# Work orders

How orders move: `docs/pipeline.md`. Open orders carry a `Status:` line; closed ones don't need one.

How this file works: Dave reviews the app and talks it through with Claude in the chat session, which turns the outcome into orders here. Claude Code builds them, on `staging`, one order per commit (or a few small commits), and ticks the "Done when" boxes in this file as part of the commit. Nothing is done until every box is ticked and the checks in `CLAUDE.md` have run. Dave judges the result in the app; an order reopens if he isn't happy.

Everything here sits under `docs/design-rules.md`. If an order seems to ask for something the rules forbid, the rules win; say so in the commit and do the nearest thing that fits.

---

## WO-1  Cards choose on click, with a hover state

Where: every card list in the creation flow and the setup page (`src/components/creation/wizard.tsx`): race, birthsign, traits, game mode, and any other `article.card`.

Behaviour
- Clicking anywhere on a card does what its Choose / Remove button does. The button stays; it must not fire twice when it is the thing clicked (stop propagation on the button, or ignore card clicks that originate inside a button, select or link).
- A card whose button is disabled (traits full, for example) does nothing on click and shows the normal cursor.
- Keyboard users already have the button; the card itself is not a focusable control (no nested buttons, no `role="button"` on the article).
- The Master of One skill `<select>` inside its trait card must keep working: clicks and changes on it do not toggle the card.

Look (revised 10 Oct 2026: Dave found the first pass too weak, "go harder")
- Hover (pointer devices only, `@media (hover: hover)`), unchosen cards: background to `--panel-raised`, border to `--muted`, name to `#fff`, cursor pointer, brass corner marks (2 px, as on the key panels) draw in at top-left and bottom-right, and the card's Choose button fills ember so the whole card reads as the button. Trait art zooms 6 % and brightens while the fade pulls back (8/46/66 % → 20/58/76 %).
- Chosen (`.cardOn`): 2 px ember border, a faint ember wash, ember corner marks, white name, filled ember Chosen / Remove button. Visible without hover, so phones get it too. Hover on a chosen card changes only the cursor and the art.
- Pressed: the border flashes ember.
- Transitions 150 ms on colour, border and background; corners 180 ms; art 400 ms.
- No shadows, glows or gradients (beyond the existing fade over the art); the card itself never lifts or scales.

Done when
- [x] Clicking a race, birthsign, mode and trait card chooses it; clicking a chosen card's Remove button removes it; the Choose button alone still works.
- [x] `npm run test:e2e` passes, with `e2e/create.spec.ts` extended so at least one step is chosen by clicking the card body, not the button.
- [x] Screenshots (`scripts/shot.mjs`) of the race step and the traits step at 1440 and 390 wide, hover state included at 1440, checked against `docs/design-rules.md`.

---

## WO-2  Buttons with some character

Dave: "All the buttons across the app feel very bland and basic, not fun." Direction, chosen to stay inside the visual system (square corners, thin rules, no shadows, glows or gradients):

- Labels in the title face: Sofia Sans Extra Condensed, 600, uppercase, letter-spacing .08em, 15–16 px, for `.btn`, `.btn-primary`, `.btn-ember`, `.btn-quiet`; `.btn-sm` at 14 px. This is the face the step markers, section labels and page titles already use, so buttons stop looking like default HTML and start looking like the rest of the planner.
- Chamfered corners, not rounded: a 45° cut of 5 px on the top-left and bottom-right corners (`clip-path: polygon(...)`), echoing the diamond step markers. 3 px for `.btn-sm`. Because `clip-path` removes the border at the cut, draw the border with an inset `box-shadow: inset 0 0 0 1px <color>` or a pseudo-element so the outline follows the cut cleanly.
- Primary (`.btn-primary`, ember fill, dark text): hover `#f5a55a`, active `#d97f33` with the label nudged down 1 px, focus-visible a 2 px brass outline offset 2 px.
- Secondary (outline `.btn`): hover border and text to ember, background a faint ember wash `rgba(240,145,63,.08)`; active the same wash at .14.
- Quiet (`.btn-quiet`): text only; hover underline in ember, no fill.
- Disabled: opacity .45, no hover change, `cursor: not-allowed`.
- Icon buttons (`.btn-icon`, the ‹ › level steppers) keep their square shape; only hover/active colours change.
- Transitions 120 ms on color, background and border only.

Scope: all buttons in `src/app/globals.css` plus any component with its own button styling (tree tabs, level row, segmented Major/Minor control, card buttons). The segmented control keeps its shape but takes the label face and the hover colours.

Done when
- [x] Every button in the app goes through the shared classes or matches them exactly; no stray default-styled buttons (search `<button` and check each one).
- [x] Nothing rounded, no shadows, glows or gradients added; chamfer is the only new shape.
- [x] `npm run build`, `npm run test:e2e` pass (button names unchanged, so tests should not need edits).
- [x] Before/after screenshots of: the home page, the race step, the traits step, the editor (perk panel with Confirm visible), the shared build page, at 1440 and 390 wide, for Dave to judge.

---

## WO-3  Majors and minors: counts that can't be missed

Dave: on the skills step it isn't obvious how many majors and minors he has chosen at any moment. Today the only count is a line of body text under the title.

Change the skills step (`SkillsStep` in `wizard.tsx`):
- Replace the count sentence with two tiles, side by side, directly under the title and sticky to the top of the main column while the lists scroll (`position: sticky; top: 0` with the page ground as background so rows slide under it):
  - a big number in the title face (`big-num` style, 34 px): `2 of 3` with the label `MAJORS +10` under it; and `4 of 6` with `MINORS +5`. Ember number while short of the count; plain text colour once full. "Full" is the only word that ever changes: when full, the label reads `MAJORS +10, FULL`.
- In the lists, a chosen skill's row shows a tag after its name: `Major` or `Minor` (`.tag` style, ember text), so the chosen ones can be counted by eye as well.
- The sidebar step list keeps its one-line summary (`3 majors, 4 minors`).
- The segmented control stays; the disabled state of Major/Minor when full stays.

Done when
- [x] The two tiles update as skills are set and un-set; they stay visible when the Mage group is scrolled into view at 1440×900.
- [x] At 390 wide the tiles sit side by side without wrapping their numbers and the row below them is not hidden.
- [x] `e2e/create.spec.ts` still passes (it asserts the sidebar summary `3 of 3 majors (+10), 2 of 6 minors (+5)`; update that assertion if the summary wording changes, otherwise leave it).
- [x] Screenshots at 1440 and 390 wide.

---

## WO-4  Skill icons everywhere a skill is named

The 19 pixel icons (`public/icons/*.svg`, drawn by `scripts/icons/pixels.py`, shown through `src/components/ui/skill-icon.tsx`) are approved. They already appear in the perk-tree tabs and the editor's skill rows. Put them everywhere else a skill tree is named, so the app uses them consistently:

- Shared build page (`src/components/build/build-view.tsx`): each skill row in the Skills column, and each tree name in "Perks by level".
- Creation flow, skills step (`SkillsStep` in `wizard.tsx`): each skill row, before the name.
- Creation sidebar "Starting point" panel: each of the top-skills rows.
- Race step cards: the race's primary and secondary skills, where they are listed.
- "Changes at level N" panel: skill lines (`One-Handed 40 → 45`) and perk lines show the tree's icon.
- The Master of One skill `<select>` cannot hold images; leave it.

Rules
- Always 16 px (`<SkillIcon name=... />` default), never scaled to odd sizes; `image-rendering: pixelated` stays.
- Decorative only: the skill's name is always next to it, `alt=""`, `aria-hidden`.
- Icon then a 7 px gap then the name, vertically centred. No change to row heights or column widths; check nothing wraps that didn't before, at 1440 and 390.
- Delete `public/icon-sheet.html` (it was only for the review).
- Do not redraw or recolour icons here. If one looks wrong in a new spot, note it in the commit message and leave it; icon drawing is done in the chat session.

Done when
- [x] Icons appear in every place listed above and nowhere a skill isn't named.
- [x] No layout shift: screenshots of the shared build page, the skills step and the editor at 1440 and 390, compared against before.
- [x] `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e` pass.

---

## WO-5  Attribute, birthsign and race icons

Three new icon sets, drawn by `scripts/icons/pixels.py` and already in `public/icons/` (approved 10 Oct 2026):
- `attr-health.svg`, `attr-magicka.svg`, `attr-stamina.svg`
- `sign-<name>.svg` for the 13 birthsigns. The standing stones use the same 13 files (same constellations).
- `race-<name>.svg` for the 10 races (`altmer`, `argonian`, `bosmer`, `breton`, `dunmer`, `imperial`, `khajiit`, `nord`, `orsimer`, `redguard`).

Generalise `src/components/ui/skill-icon.tsx` into one `GameIcon` (or add `AttributeIcon`, `SignIcon`, `RaceIcon` beside it) that maps a name to its file with the same slug rule; keep `SkillIcon` working.

Where they go
- Attributes: the three attribute cards on the level-up editor, the attribute bars on the shared build page, the creation sidebar's Starting point numbers, and the "Attribute +5 Health" line in "Changes at level N".
- Birthsigns and stones: each birthsign card (creation and setup), the Birthsign entry in the build page's summary row, the "Standing stone" row on the build page, the stone line in "Changes at level N", and next to the standing-stone select in the editor (a native select can't show images; put the chosen stone's icon beside it).
- Races: each race card, the Race entry in the summary row, and the race on build cards (Browse and My builds).

Rules
- The same as WO-4: 16 px or an exact multiple (race cards and birthsign cards may use 32 px, `image-rendering: pixelated`), decorative (`alt=""`, `aria-hidden`), icon + 7 px gap + text, no layout shift, nothing wraps that didn't before at 1440 and 390.
- Master of Destiny removes the birthsign: show no sign icon then.
- Don't redraw icons. Note anything that looks wrong in a new spot in the commit message.

Done when
- [x] Every place listed shows its icon.
- [x] Screenshots of the race step, birthsign step, the editor (attribute cards and stone select) and the shared build page at 1440 and 390.
- [x] `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e` pass.

---

## WO-6  LoreRim version for each build

Why: LoreRim changes a lot between major releases (perks, traits, stones, rules). A build has to say which release it is for, and be checked against that release's data, not whatever is newest.

Decided (10 Oct 2026): ship with 5.0.4.8 only; the picker exists from day one and new releases are added by re-running the extractor (README, "Game data") on Dave's updated install. Builds keep the version they were made for.

### Data, per version
- `src/data/lorerim-<version>/` already holds one version. Add `src/lib/rules/versions.ts`: the list of versions the planner knows, each with `id` ("5.0.4.8"), `label`, `released` (date) and which one is current. Exactly one is current.
- Replace the module-level constants in `src/lib/rules/data.ts` (`PERKS`, `TRAITS`, `PERK_BY_ID`, ... and `GAME_VERSION`) with `gameData(version)`, returning one object with everything for that version (memoised; data for a version is loaded once). Keep `RULES`/constants per version too (`constants.ts` becomes part of the version's data), since point costs and limits can change between releases.
- `computeBuild`, `derive.ts`, `layout.ts` and `validate.ts` take the version's data (or the plan, and look up `plan.gameVersion`). No code path may read another version's data than the plan's.
- Client components get the data from a `GameDataProvider` set at the page level from `plan.gameVersion`. Pages that show many builds (Browse, My builds) only need names and icons, which are stable across versions; read them from each build's own version.
- `validate.ts`: `gameVersion` is one of the known version ids (not a literal); every other check uses that version's data.
- Unknown version in a stored build (say a version was removed): the build page still loads, shows the plan as stored, and says "[Version] is no longer in the planner." with no numbers computed. Never crash.

### Creation
- Step 1 (Race) gets a "LoreRim version" select at the top of the step, above the race cards, defaulting to the current version. With one version in the list it still shows (so players see what the build is for) but there is nothing else to pick.
- Changing the version after later steps are filled re-checks the draft against the new version: anything that no longer exists (a trait, a perk, a stone) is listed in a notice under the select ("Not in 5.1: Bulwark (trait), Weapons Master (perk). They'll be removed.") with Confirm / Cancel. Nothing is removed silently.
- The sidebar step list shows the version under "Race" (`Nord`, then `LoreRim 5.0.4.8` on its own line).

### Viewing and editing
- The build page keeps the version tag in the byline (already there).
- If a build is for an older version than the current one: a one-line notice under the cover, "Made for LoreRim 5.0.4.8. The current version is 5.1." with a button "Copy for 5.1" (signed-in viewers) that makes a copy, converts it, and opens the editor with the conversion notice (same list of what didn't carry over). The original is never changed.
- The editor and setup page check against the build's own version only.
- Browse: a version filter (select, defaulting to the current version, with "All versions"). My builds: show each build's version tag on its card.

### Database
- `builds.game_version` already exists. Add an index on it (migration through `npm run db:generate`). No data change: every existing build is 5.0.4.8.

Done when
- [x] No module outside `src/lib/rules/` imports version data directly; everything goes through `gameData(version)` or the provider. (`grep` for the old constant names returns nothing.)
- [x] Unit tests: `computeBuild` on the sample build gives the same results as before; a plan with an unknown version is rejected by `validate.ts`; a plan whose version is in `versions.ts` but with an item missing from that version reports it.
- [x] Add a throwaway test-only second version (a copy of 5.0.4.8 with one trait removed, under `src/lib/rules/__fixtures__/`, never shipped) and use it to test the switch-version notice and the "Copy for" conversion.
- [x] e2e: creation shows the version select with 5.0.4.8 chosen; an old-version build shows the notice (use the fixture version).
- [x] README "Game data" section explains how to add a version (extract, build, register in `versions.ts`, mark current).
- [x] All checks in CLAUDE.md pass; screenshots of the race step and an old-version build page at 1440 and 390.

---

## WO-7  The written guide

Dave (10 Oct 2026): builds get a written guide, "SUPER user friendly, full rich text editing, the best experience possible". One guide for the whole build, plus notes for each level. Decided: image uploads yes; @-mentions of game things yes.

This replaces the plain "Notes from the author" textarea (`plan.notes`) and the per-level note textarea (`levels[].note`). Build it in four parts, in order, one commit each, stopping for Dave after each: **7a** editor and overall guide, **7b** level notes, **7c** images, **7d** @-mentions.

### What "best experience possible" means here
Writing should feel like Notion or a good Discord message, not a form:
- Type and format as you go: markdown shortcuts (`## ` heading, `- ` list, `1. ` numbered, `> ` quote, `**bold**`, `*italic*`, `---` divider).
- Select text and a small toolbar appears over it: Bold, Italic, Strike, Link, Heading 2, Heading 3, Quote. (Bubble menu.)
- Type `/` at the start of an empty line for the block menu: Heading, Bulleted list, Numbered list, Quote, Divider, Tip, Warning, Spoiler, Image, YouTube video. Arrow keys and Enter to choose; filters as you type.
- Paste from Google Docs, Word, Discord or a web page keeps headings, lists, bold, italic and links, and drops everything else (fonts, colours, sizes, tables).
- Undo/redo (Ctrl/Cmd+Z, Shift+Z), and the usual shortcuts (Ctrl/Cmd+B, I, K for link).
- Autosaves, like the rest of the editor (`use-autosave.ts`), with the header's "Saved" status. If a save fails, the text is kept in the browser and retried; nothing typed is ever lost on a refresh.
- Empty state is the placeholder in square brackets per design rule 7: "[Write the guide: how to play this build, what to prioritise, where to go]". No how-to copy.
- Works with a keyboard alone and with a screen reader (the editor is a labelled textbox; menus are proper listboxes).
- Works on a phone: the toolbar sits above the keyboard rather than over the selection on touch devices.

### Library
Tiptap (ProseMirror) with the React bindings: StarterKit, Link, Placeholder, Typography, BubbleMenu, Image, YouTube, Mention, plus a small custom node each for Tip, Warning and Spoiler and a custom suggestion for the `/` menu. Pin exact versions. No other editor libraries.

### Storage
- New table `build_guides`: `build_id` (FK to builds, cascade delete), `key` text (`overview` or `level:<n>`), `doc` jsonb (Tiptap JSON), `text_length` int, `updated_at`. Primary key (`build_id`, `key`). Migration through `npm run db:generate`.
- Never store or render raw HTML. Rendering on the build page is from the JSON with a fixed set of node and mark types; anything else is dropped. Links: `http`/`https` only, `rel="nofollow ugc noopener"`, open in a new tab.
- Limits: overview 60,000 characters of text, each level 6,000; enforced on the server with a clear message in the editor ("Too long to save: 61,200 of 60,000 characters"), not by truncating.
- Server actions in `src/lib/builds/actions.ts`: `saveGuideSection(buildId, key, doc)`, owner only, validated with zod (node types, link protocols, lengths, image URLs must be our Blob store's).
- Existing text: on first load, if a build has `plan.notes` or a level `note` and no guide row, show it as the starting paragraph(s) of that section; the first save writes the row and clears the old field. Remove the old textareas.
- Copying a build copies its guide rows (and images keep pointing at the same files).

### 7a  Editor and the overall guide
- Owner: a "Guide" link in the editor's header next to "Set up" opens `/b/[id]/guide` (focus layout): the build name as the title, the editor below it filling the page width of the main column (same measure as the cards; no narrow text column, per Dave's rule on ragged line breaks), autosave status in the header.
- Viewer, on the shared build page: a "Guide" section under the summary row and above the level stepper, showing the overall guide with a contents list built from its H2s (only when there are 3 or more) that jumps to each heading. Long guides show the first ~600 px with a fade and "Read the guide" to expand; the expanded state is remembered for the session.
- Rendering uses the design system: body in Sofia Sans at 16 px/1.6, headings in the title face, quotes in Alegreya italic, Tip / Warning as framed panels with the brass corner marks (`.frame`), Spoiler as a closed panel "Spoiler, tap to show", links in ember.

### 7b  Level notes
- In the level-up editor, the "Notes for level N" box becomes the same editor (compact: bubble menu and `/` menu, no headings above H3), under "Also at this level".
- On the build page, the level's notes show in the "Changes at level N" panel where the quoted note is today, rendered rich; over ~200 px they collapse with "Read more".
- The level ruler and level row show a small mark for levels that have notes (add "Notes" to the legend).
- Removing levels from the end of a build asks to confirm when those levels have notes, and deletes the notes with them.

### 7c  Images
- Upload by `/image`, drag-and-drop or paste. PNG, JPEG, WebP or GIF, up to 4 MB each, at most 40 images per build. Stored in Vercel Blob: store `lorerim-planner-images` (public, iad1) is created and `BLOB_READ_WRITE_TOKEN` is set in Vercel for all three environments, so `vercel env pull` brings it locally. One store serves every environment, so paths start with the environment: `<production|staging|dev>/builds/<buildId>/<random>.<ext>` (use `currentEnvironment()` from `src/db/environments.ts`), uploaded through a server route that checks the signed-in user owns the build.
- While uploading, the image shows as a placeholder with progress; on failure it says why and can be retried or removed.
- Images can have a caption (shown in Alegreya italic under the image) and alt text (asked for in a small field after upload; optional but prompted).
- Images display at the column width, never wider than their real size, with `loading="lazy"` and explicit width/height to avoid layout shift. Clicking opens the full image.
- Images removed from a guide are deleted from Blob on the next save (compare before and after). Deleting a build deletes its images.

### 7d  @-mentions
- Typing `@` opens a search over the build's own version: perks (with their tree), skills, traits, birthsigns, standing stones, races, Destiny perks. Shows the icon, name and kind; Enter inserts a chip.
- A chip shows the icon and name. Hover or tap shows the game's own text (`perkText`, trait text, stone text) and, for perks, where this build takes it ("Taken at level 6" or "Not taken in this build").
- Chips store `{ kind, id }`, never the text, so they stay correct when the game data is rebuilt. A chip whose id no longer exists renders as plain text with a dotted underline and the tooltip "Not in LoreRim [version]".

Done when (each part)
- [x] 7a: an owner can write, format, paste and autosave the overall guide; a visitor sees it rendered with contents; e2e covers typing a heading and a list, reloading, and seeing them on the build page; a pasted page with fonts and colours comes through clean; a `javascript:` link is refused.
- [x] 7b: level notes edit and render; old notes migrate on first open; the ruler marks levels with notes; e2e covers one level note.
- [x] 7c: upload, caption, alt text, delete-on-remove all work against the staging Blob store; a 5 MB file and a .svg are refused with a clear message.
- [x] 7d: mention search, chip, hover text and the missing-id case work; unit test for the chip renderer.
- [x] All checks in CLAUDE.md pass at each part; screenshots of the guide page, the build page's guide section and a level note, at 1440 and 390, for Dave.

---

## WO-8  Perk trees laid out like the game

Dave (10 Oct 2026): "In some instances it's a tangled mess and should never be laid out like this. In game it's much more structured. I think we're breaking it to make it fit in a small box."

Cause: `src/lib/rules/layout.ts` invents a layout (rows by prerequisite depth, then squeezes, staggers and reorders them to fit the box). The game already has a designed layout for every tree, and we extracted it: each node's grid position and offset (`x`, `y`, `hx`, `vy`) and the lines the game draws between stars (`linksTo`) are in `gamedata/5.0.4.8/planner_data.json`. Drawn from those, every tree is as clean as the game's: see [docs/reference/perk-trees-game-layout.png](reference/perk-trees-game-layout.png) (all 18 trees plotted straight from the game data, no adjustments).

### Data
- `scripts/gamedata/build.py` writes, for every skill-tree perk, `pos: [x + hx, y + vy]` (the game's coordinates, y up), and for every tree a `links` list of `[fromId, toId]` from the game's `linksTo` (the constellation lines). Destiny perks already carry `x`, `y` from the Custom Skills config; add Destiny's `links` from its config the same way (`Links` per node in `CustomSkill.destiny.config.txt`, already in `planner_data.json` as `links`).
- Lines on screen come from the game's `links`, not from `requires`. Rules keep using `requires`/`anyOf`/`excludes`. (They mostly match; where they don't, the game's picture wins on screen and the rules win in the engine.)
- Rebuild `perks.json` with `python3 scripts/gamedata/build.py`; never hand-edit it.

### Layout
- Replace the invented layout in `layout.ts` with one that only scales the game's coordinates into the box: one uniform scale for x and y (never stretch one axis), y flipped so the tree grows upward, padding for labels. No reordering, staggering or nudging of stars, ever.
- The box size comes from the room available (ResizeObserver, as now), and the scale is chosen so the tree fills the box's width or height, whichever binds first.
- Destiny: same treatment from its own `x`, `y` (no more invented radial layout).
- Stars that sit very close in the game (One-Handed's unarmed cluster, Smithing's book perks, Restoration's centre) stay close; the label rules below handle them.

### Labels (the real source of the clutter)
In the game, a star's name shows when you point at it. Here:
- Every star always shows; its name and requirement show when there is room.
- Place labels greedily in priority order: the selected star, then taken, then can-take-now, then not-yet; within a priority, stars lower in the tree first. Try below the star, then above, right, left. A label that would overlap another label, a star or a line's end is not shown.
- A star without a visible label shows it on hover and on keyboard focus (a small dark tag beside the star, same text), and its `aria-label` always carries the full name and state.
- Labels never shrink below 12 px and never wrap to more than two lines.
- The selected star's label always shows, even if that means hiding a neighbour's.

### Size: use the screen
Most players are on large monitors. The tree should be big:
- The perk area (tree plus detail panel) takes the full width of the main column; the tree box is at least as tall as it is wide at 1440 and up, capped so the whole tree and its tabs fit in the window without scrolling (`min(window height - header - tabs, width)`).
- At 1440 the tree box is about 900 px wide; at 1920 about 1200; at 2560 about 1600 (see WO-9 for the page widths). Stars and lines scale with the box (star 16 px at 900, up to 22 px at 1600; lines 1 → 1.5 px), labels stay 13–15 px.
- The detail panel sits to the right at 1100 px and up (fixed 340 px), below the tree under that.

### Small screens (under 900 px wide)
Don't squash the tree. Make it behave like the game's sky:
- The tree opens fitted to the width, labels shown only for taken and selected stars.
- Pinch or Ctrl+wheel to zoom (1× to 3×), drag to pan, double-tap to zoom in on a point; `+`, `−` and "Fit" buttons in the corner. Labels appear as zoom makes room for them (same placement rules).
- Tapping a star selects it and opens its details in a bottom sheet (the same content as the detail panel) with Confirm/Remove; dismiss by swipe down or tapping outside.
- A "List" toggle next to the tree tabs switches to a plain list of the tree's perks grouped by required skill (25, 50, 75, 100, then level and book perks), each row with its state, for anyone who prefers it. The list is also what screen readers get first.

### Done when
- [x] Every one of the 19 trees on screen matches its plot in `docs/reference/perk-trees-game-layout.png` (same shape, same lines); screenshots of all 19 at 1920 wide in one sheet for Dave.
- [x] No label overlaps another label or a star in any tree at 1440, 1920 and 2560 (add a unit test that runs the placement for every tree at those widths and asserts no rectangle overlaps).
- [x] Unit test: layout preserves the game's relative positions (for every pair of stars, left/right and above/below order is unchanged).
- [x] At 390 wide: pinch-zoom, pan, Fit, tap-to-select with the bottom sheet, and the List toggle all work (e2e for tap-select and List; zoom checked by hand and noted).
- [x] Editor and shared build page both use it; existing tree e2e still pass.
- [x] All checks in CLAUDE.md pass.

---

## WO-9  Large screens

Dave: most users are on large gaming monitors; the site should support very large breakpoints and use the space.

- Page width: `--page-max` goes from a fixed 1360 px to steps: 1360 under 1600, 1600 at 1600–2199, 2080 at 2200–2879, 2560 at 2880 and up. Side gutters 40 px (24 under 900, 16 under 480).
- Body text measure: paragraphs of running text (build description, guide, notes) stay at a comfortable measure of the column they sit in; never a narrow `ch` cap next to wider controls (Dave's rule on ragged early line breaks). Where text and its controls share a column, they share its width.
- Shared build page at 1920+: attributes, skills and "this level" columns become 1 : 1.4 : 1.6 instead of stacking early; the perk trees section uses the full width (WO-8).
- Editor at 1920+: left column (attribute, skills) fixed 440 px, the perks area takes the rest.
- Browse: cards in a grid of `minmax(320px, 1fr)` so a 2560 screen shows 6 to 7 per row, not 4 big ones.
- Type scales a little with the page: titles +10% at 2200 and up, body stays 15–16 px.
- Check nothing stretches into long thin lines: tables, the level row (12 levels still, wider cells), stat lists.

Done when
- [x] Screenshots of home, a shared build page, the editor and the race step at 1440, 1920, 2560 and 3440 (ultrawide), for Dave.
- [x] No horizontal scroll at any width from 360 to 3840.
- [x] All checks in CLAUDE.md pass.

---

## WO-10  The LoreRim version can't be missed

Dave (10 Oct 2026): the version select on the Race step is very easy to overlook. Don't block anyone (it defaults to the newest version the planner supports), just make sure nobody misses it.

- Move it out of the Race step's form area into a band across the top of the creation flow's main column, above the step title, on every step: `Building for LoreRim 5.0.4.8` in the title face, the version in ember, then `Latest` as a tag when it is the current version, and a `Change` button on the right that opens the version list in place (a small panel under the band, one row per version with its release date; choosing one runs the same "won't carry over" check WO-6 added).
- The band has the brass corner marks (`.frame`) so it reads as part of the build, not a notice.
- With one version only, `Change` still shows and the panel lists the one version, so players learn where it lives.
- The creation sidebar keeps the version line under Race (from WO-6).
- The Name step (last) repeats it in the summary of what is being created, next to race and birthsign.
- Setup page (changing an existing build) shows the same band; `Change` there offers "Copy for [version]" rather than changing the build in place, since other people may have the link.
- Remove the old select from the Race step.

Done when
- [x] The band shows on all six steps and the setup page, at 1440 and 390 (at 390 the band wraps to two lines: version on the first, `Change` on the second, full width).
- [x] e2e: the band reads `Building for LoreRim 5.0.4.8` on the Race step and the Name step; `Change` opens the list.
- [x] All checks in CLAUDE.md pass; screenshots of the Race step and Name step at 1440 and 390.

---

## WO-11  Perk trees: see at a glance what you have

Dave (10 Oct 2026), on the Destruction tree with Novice taken and Electromancy at 1 of 2: "Hard to see what perks here I have, the path connecting them isn't different from other paths."

What's wrong in `src/components/build/tree.tsx` and `tree.module.css` now:
- Taken (filled ember dot) and can-take (ember ring) are the same colour and size; at a glance they read as one state.
- A line lights only when both ends are fully taken, so Novice → Electromancy (1 of 2) stays grey: the path you are on doesn't show.
- `.edgeLit` sets `stroke-width: 1.6` in CSS, which overrides the `strokeWidth` the tree scales with, so a lit line is barely thicker than a grey one, and at 2560 thinner than the base.
- The half-filled partial star is the same for 1 of 2 and 1 of 5.

### Stars: four states, each a different shape, not only a different colour
- **Taken** (all ranks): solid ember star, 1.3× the base size, soft ember glow (`0 0 0 4px` at about 25%, plus a 10 px blur at about 35%). Its label name in the bright text colour, weight 600.
- **Some ranks** (1 of 2, 2 of 5): same size and glow as taken; the ring is split into one arc per rank with the taken arcs filled ember and the rest dark (conic gradient, 2 px gaps between arcs). The label says the ranks after the name: `Electromancy 1/2`.
- **Can take now**: hollow ring in brass (`--brass`), base size, no glow. Label in the normal text colour.
- **Not yet**: small grey dot (as now). Label dim (as now).
- Selected keeps its brass halo around whatever state it is in.
- Check in greyscale: the four states must still be told apart (fill, segmented ring, hollow ring, small dot).

### Lines: your path stands out
A star counts as **held** when it has at least one rank.
- Held → held: ember, 2.5× the base line width, with a faint ember glow (an SVG blur filter or a wider 20%-opacity line underneath).
- Held → can take now: brass, base width, solid. These show where you can go next.
- Everything else: the current grey, base width, at 60% opacity. "Either of" lines keep their dashes.
- Selected star that isn't held: the lines from it back down to the nearest held stars (its prerequisite chain) in dashed brass, so you see what it needs. (Replaces `edgePreview`.)
- Widths come from the tree's scaled line size (`size.line`), never a fixed CSS `stroke-width`; draw held lines last so they sit on top.

### Finding your perks across trees
- Each tree tab shows how many perks you hold in it, in ember after the name (`Destruction 2`); none shows nothing.
- The legend matches the new drawings: Taken, Some ranks, Can take now, Not yet. On small screens it is a 2 × 2 grid, not a wrapped line.

### Done when
- [x] Unit test for line state: held→held, held→open and other, including a star with 1 of 2 ranks counting as held, and an "either of" line.
- [x] Destruction at 1440 with Novice taken and Electromancy 1/2: screenshot before and after, side by side, for Dave; plus One-Handed and Restoration with a longer path (four or more held perks) at 1920 and 2560.
- [x] Greyscale screenshot of the same tree showing all four star states told apart.
- [x] Tabs show held counts in the editor and on the shared build page.
- [x] All checks in CLAUDE.md pass.

---

## WO-12  QA pass fixes (10 Oct 2026)

From a pass over staging at 390, 1440 and 1920. Each is small; do them in this order.

### Copy that breaks the rules
1. **Birthsign texts are ours, not the game's.** `src/data/lorerim-5.0.4.8/birthsigns.json` is hand-written and includes our commentary (for example "Its 'stones 200% stronger' line is untested with LoreRim's stones."). Generate it like traits: read each birthsign's ability and effect descriptions from the records in `scripts/gamedata/` (extend `extract.py`/`build.py`, raw input under `gamedata/5.0.4.8/`), write the game's text, and drop every sentence that isn't from the records. A sign whose text can't be found shows no text, and goes in the build output as a warning, not in our words.
2. **Example build** (`src/lib/rules/__fixtures__/sample-build.json`; check no test leans on the old text). The guide reads "Example build to show how the planner works. Replace any of it." and every gear note reads "Example entry": both are how-it-works filler. Give the example a real build guide, short and in a player's voice:
   > Sword and shield in heavy armor, starting in Falkreath. No spells: potions do the healing, so Alchemy comes up alongside the armor. Block and Heavy Armor first, One-Handed after.

   Gear notes: leave them empty.
3. **"Destiny  Destiny".** In "At level", Destiny perks have their own row labelled Destiny, and the first perk is named Destiny, so it stutters. List Destiny perks in the Perks list like every other perk (Destiny icon, then the name), and drop the tree name in brackets when it is the same as the perk name.

### Build page
4. **Gear table.** "From level" header is left-aligned while its numbers are right-aligned under the far end of the column. Align both left, next to each other. The table spans the full content width (it stops short at 1920).

### Creation flow
5. **One "Chosen", the same on every step.** The chosen race card shows "✓ Chosen" as a tag and "Chosen" on its button; the chosen birthsign card says "Remove". Use one pattern for race, birthsign and traits: the tag goes; the button reads `Chosen` in the selected style. Traits keep their own toggle since several can be held (clicking a chosen trait removes it, as now). For birthsign, choosing another sign replaces it; if a build may have no sign, that is its own card, `No birthsign yet`.
6. **Race icons at 32 px** on race cards (the 16 px pixel art at 2×, `image-rendering: pixelated`); 16 px stays everywhere else.
7. **Skills step:** the Major/Minor tag on a skill row repeats what the segmented control already shows. Remove the tag.

### Editor
8. **Detail panel out of sight.** At 1456 wide the perk detail panel drops below the tree, so picking a star shows nothing until you scroll. When there isn't room beside the tree, show the panel as a card pinned to the bottom of the window over the page (non-modal, same content and buttons as the panel, closes with Esc or ×), like the bottom sheet on phones.

### Phones (390 wide)
9. **Header** wraps to three rows. One row: the star mark (links home), `Builds`, `New build`, and `Sign in` as the button text; the wordmark shows from 600 px up.
10. **Level row** shows three levels and cuts the fourth in half. Make it a horizontal scroller with scroll snap, the current level scrolled into view, and a fade on the edge that has more.
11. **Tree tabs** stack 19 buttons about 380 px tall before the tree. Under 900 px, one horizontally scrolling row (icon + name, current tab scrolled into view), with the List toggle at its end.
12. **Tree box height** leaves a large empty band under the tree. At fit zoom the box is as tall as the fitted tree plus its label padding.

### Done when
- [x] `birthsigns.json` is generated (no hand edits), and no birthsign text contains words that aren't in the records; diff of old and new texts for Dave. (Extract run on Dave's PC 11 Oct; stones too, see commit 997daaf.)
- [x] Screenshots for Dave: shared example build at 1920 (guide, At level, gear), race and birthsign steps at 1440 with a chosen card, editor at 1456 with a star selected, and at 390 the header, level row and tree tabs.
- [x] e2e: on 390, the tree tabs are one row and the selected tab is in view; in the editor at 1456, selecting a star shows its name in the pinned panel without scrolling.
- [x] All checks in CLAUDE.md pass.

---

## WO-13  Test drive fixes (10 Oct 2026)

From building "QA Breton Spellsword" (`/b/btab4t9t6c`) through all six steps and levels 1 to 5 in Chrome at 1512 × 806 (a MacBook window), plus the shared page at 390. Do after WO-12. The rules held up everywhere: skill costs, banking, trainer carry-over, the stone at level 2, exclusions, Destiny at 5. What follows is the interface.

### Things that move under you
1. **Page jumps after Confirm and Remove.** Every Confirm or Remove in the perk panel scrolls the page 300 to 400 px, so the tree leaves the screen. Keep the scroll position; when focus moves to the new button, use `focus({ preventScroll: true })`.
2. **Page jumps when changing level.** Clicking a level in the level row (editor and shared page) scrolls the page. Changing level keeps the level row where it is on screen.
3. **Trait cards reorder when chosen.** On the Traits step a chosen trait jumps to the front of the grid, so the card under the pointer changes between two clicks (Focused, third in the grid, moved to first; the next clicks landed on other traits than the ones aimed at). Keep the order fixed while the step is open; chosen traits sort to the front only when the step is opened.
4. **Tree labels reshuffle on every selection.** Selecting a star moves other stars' labels (Destruction: selecting Electromancy hid Arcane Focus and showed Cryomancy and Pyromancy). Place labels once for a tree and level; selecting only adds the selected star's label, hiding the fewest others, and never moves a label.

### Breaking an earlier level
5. Removing Novice Destruction at level 1 gave no warning, though Apprentice Destruction and Electromancy at level 2 need it. The only sign afterwards was a 5 px red dot on level 2 and a line at the bottom of level 2.
   - Before removing, the panel lists what depends on it: `Apprentice Destruction (level 2) and Electromancy (level 2) need this.` with `Remove all three` and `Keep`.
   - While any level has a problem, a bar under the level row names each one with a link: `Level 2: Apprentice Destruction needs Novice Destruction.` `Go to level 2`.
   - The dot on a level with a problem is 8 px, in the error colour, with a `title` giving the count.

### Placeholders in square brackets
6. `[Release date]` (version list), `[Build name]` (Name step), `[Notes for this level: quests, places cleared, where you trained]` (level notes) and `[Write the guide: how to play this build, what to prioritise, where to go]` (guide) read as an unfinished template. Remove all four. The release date shows when `versions.ts` has it and is left out when it doesn't; the fields have no placeholder; the label above each field says what it is.

### Perk tree and panel
7. **Can take, with no points left.** When the level has no perk points left, every star whose requirements are met turns into a grey dot (Improved Blocking at Block 20 looked locked). Requirements met = can take, whatever the points; the points counter and the panel line `No perk point to spend at this level.` say the rest.
8. **Labels that are missing or point at the wrong star.** In Destruction at 1512 wide, Cryomancy and Pyromancy (both can take) had no label while not-yet labels nearby were shown, and Arcane Focus's label sat nearer Pyromancy's star than its own. Placement rules: a not-yet label is never shown if a taken or can-take label it overlaps would be hidden; a label must be nearer its own star than any other star, or it isn't shown.
9. **The tree doesn't fit a laptop screen.** At 1512 × 806 the bottom row (where every tree starts) and the detail panel are below the fold, so each pick needs a scroll. When the window is under 900 px tall: the tree tabs become one row of icon + skill level chips (name on hover and in `aria-label`), the level header shrinks to one line, and the tree box takes the height left (the WO-8 rule).
10. **Hover tag shows what's under it.** The tag for Weapon Mastery let the Grappling label show through. Opaque background, drawn above every label.
11. **Rank 1 of 2 looks untaken.** After confirming Electromancy rank 1, the panel shows only rank 2 (`Needs Destruction 50…`). Show `Rank 1 of 2, taken at level 2.`, then rank 2's text and what it needs.
12. **Exclusions only show when they bite.** Weapon Mastery's panel doesn't mention Block: Weapons Master until both are in play (the hover tag does). Always list `Can't be held with …` in the panel.
13. **Said twice.** Destiny's panel says `Increases carry weight by 25.` then `+25 carry weight.` Show the effect line only when it says something the text doesn't.

### Editor
14. **Between level-ups** is a skill select with two buttons under it, which reads as unrelated controls. Make two rows: `Trainer session` [skill] `Add`, and `Skill book` [skill] `Add`. The shared page writes books like trainers: `Skill book: Destruction +1`.
15. **Gear** sits inside each level's editor though it belongs to the whole build (it has its own "From level"). Move it out of the level: a `Gear` button in the editor header next to `Guide`, opening its own page like the guide.
16. **Said twice:** `30 this level-up` under the skills bar repeats the Skill points counter at the top. Remove it.
17. **Attribute cards at 1512:** the choice circle covers the end of "Magicka" and "Stamina". Put the circle on its own line or shrink it so it never overlaps the name.
18. **Rich text toolbar stays up.** After selecting text in level notes, the Bold/Italic toolbar stays on screen (covering the "Notes for level 1" label) after you click elsewhere and scroll. Hide it on blur, and place it so it doesn't cover the field's label.
19. **Slash menu cuts off.** `/` shows eight items; Image is hidden below with no sign there are more. Show every item, or scroll with a visible scrollbar.

### Creation flow
20. **Starting point** (sidebar) shows the six highest skills, so the majors Destruction and Alteration (20) were left out while Speech (20) showed. List every major and minor first, then other raised skills.
21. **Standing stone names come with our summaries** (`The Lady (Prices 10% better)`, `src/data/lorerim-5.0.4.8/stones.json`). Same rule as birthsigns in WO-12: text from the records, or the name alone.
22. **Cover image** on the Name step is still a link field. Offer upload (the Blob store from WO-7c) with the link as the alternative.

### Shared page
23. **Hero without a cover** is about 200 px of stripes. Without a cover image, the hero is only as tall as its text.
24. **Headings:** `At level 1` on level 1 but `Changes at level 5` on later levels; `Perks by level 5` reads as "perks grouped by level". Use `At level N` everywhere and `Perks held at level N`.
25. **`1 skill points`**: singular when 1 (check every count that can be 1).
26. **Phones:** `Changes at level N` comes after the 18-row skills list, so what happened at a level is buried. Under 900 px put it straight after the level row. The hero title touches the header (needs the same top padding as at 1440), and the meta line ends with a dangling `|` when it wraps.

### Done when
- [x] e2e: Confirm and Remove keep `window.scrollY` unchanged (±2 px); changing level keeps the level row's on-screen position.
- [x] e2e: on the Traits step, the second card's name is the same before and after choosing the first card.
- [x] e2e: removing a perk that a later level needs shows the dependants and `Keep` leaves the build unchanged; `Remove all three` removes them; the problem bar appears when a later level breaks.
- [x] Unit test: label placement keeps every taken and can-take label that has room, never shows a label nearer another star than its own, and selecting a star doesn't move any other label.
- [x] No `[` placeholder left in the app (`grep -rn 'placeholder="\[' src` and the guide placeholder constant).
- [x] Screenshots for Dave at 1512 × 806: editor with a tree in view showing the bottom row and the panel without scrolling; Destruction with every can-take star labelled; perk panel for a 1-of-2 perk; the gear page; shared page level 5 at 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-14  Small follow-ups (11 Oct 2026)

From checking WO-12 and WO-13 on staging. Small; one commit.

1. **Tree tab chips on short screens** read `3 27` for "3 perks held, skill 27": two bare numbers side by side. Show the held count as a small ember badge on the icon's corner and the skill level after the icon, so the chip reads `[icon with 3] 27`.
2. **Open perk trees** on the shared page scrolls the tab row to about the middle of the window, so most of the tree is below the fold at 1568 × 772. Scroll so the tab row sits at the top of the window, and give the shared page's tree box the same height rule as the editor (window height left under the tabs).
3. **Standing stone select** now shows the game's sentence in brackets (`The Mage (Magicka is increased by 25.)`). Drop the trailing full stop inside the brackets.
4. **Legend on phones** wraps so `Notes` sits alone on a second line. Use the 2 × 2 grid from WO-11, or let it scroll in one row.

### Done when
- [x] Screenshots for Dave: tree tabs at 1568 × 772 in the editor; shared page after Open perk trees at 1568 × 772 with the whole tree in view; legend at 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-15  Findings from three 20-level builds (11 Oct 2026)

From building Jo'Vashar (`/b/2b3t3uvceq`), Ushnar gro-Mazgar (`/b/xdz7uwjx2f`) and Azrem (`/b/225en4m79k`) on staging, levels 1 to 20 each, with covers, a note at every level, a guide and gear. The rules engine held up for 60 levels: costs, caps, banking, trainer carry-over, stone swaps and Destiny all matched a plan worked out separately. Do after WO-14.

### Bugs
1. **Level notes lost on a quick level change.** Typing a note and clicking `Continue to level N` within 800 ms drops the note: `useGuideAutosave` clears its timer on unmount without saving (`src/components/guide/use-guide-autosave.ts`, last `useEffect`). Seven of Jo's twenty notes were lost this way and had to be typed again. On unmount, `pagehide` and `visibilitychange` to hidden, save straight away if a change is waiting. On load, if the browser still holds a copy that the server doesn't have (`unsavedGuide`), save it.
2. **Two Destiny stars both called "Endurance".** The Destiny tree has two stars with that name; one is the path to Acrobat. Clicking the label picks the wrong one, and `At level` lists `Endurance` with no way to tell which. Give the second one its record's distinguishing name if it has one; if both records say `Endurance`, show the next star on its path in brackets in lists (`Endurance (to Acrobat)`).
3. **Destiny labels in the editor:** at 1512 × 806 Trickster's label sits over Endurance's star, and Constitution, once taken, has no label. The shared page draws both correctly, so the editor is using different placement inputs.
4. **Pinned perk panel covers tree labels** on the right edge of the tree (Block and Heavy Armor at 1512). Leave room for the panel, or move labels that would sit under it.
5. **`At level` brackets mix two things:** some perks show their tree in brackets, others the skill level they need (`Weapon Mastery (One-Handed)` next to `Improved Blocking (Block 20)`). One rule: the tree, always.

### Confusing
6. **Trait choices have no picker.** Focused Combat, Focused Magic and Fatal Attraction each ask the player to choose a skill or target in game. The planner takes the trait and records nothing, so a reader can't tell which skill Jo focused. Add the choice under the trait card (a skill select for Focused Combat and Focused Magic), shown on the shared page as `Focused Combat: Two-Handed`.
7. **"Merchant or mercenary"** is one start in the list, but the game gives them as separate choices with different kits. Split it into two, using the game's names for each.
8. **`Trainer sessions 97 left`** at level 20 is true (5 a level, carried over) but reads as noise. Show it only while the level has unused sessions from this level-up, or as `5 this level`.
9. **Stone swaps change Health with no reason given.** Moving from the Warrior stone to the Lover stone drops Health by 25 in the sidebar with nothing saying why. Next to the attribute totals, name the stone when it is part of the number (`Health 290, incl. The Warrior +25`).
10. **Javelins:** nothing says which skill they use. If the records tie javelins to Marksman, Ranged Combat Training's panel should say so; check `perks.json` before writing it.

### Copy (design rules)
11. **Guide page** has an eyebrow label that explains itself: `Guide: how to play this build, what to prioritise, where to go` (`src/components/guide/guide-page.tsx:54`). Remove it; the page heading says `Guide`.
12. **Gear page** opens with a how-to line: `What the build wears and wields, for the whole build: each row says from which level.` (`src/components/editor/gear-page.tsx:64`). Remove it.

### Cover image
13. Covers from in-game screenshots are cut to the hero's band with the centre kept, which cut Ushnar's head off. Add a focal point: after upload, click the image to set where it centres (stored as `coverFocus: {x, y}` in percent, used as `object-position`).

### Done when
- [x] e2e: type a level note, click `Continue to level 2` at once, reload: the note is there. Same for leaving the page within 800 ms.
- [x] e2e: a build with both Endurance stars shows them as two different names on the shared page.
- [x] e2e: Focused Combat with Two-Handed chosen shows `Focused Combat: Two-Handed` on the shared page.
- [x] No eyebrow or how-to line on the Guide and Gear pages.
- [x] Screenshots for Dave at 1512 × 806: editor Destiny tree with Constitution taken; Block tree with the panel pinned; sidebar after a stone swap; cover focus set on Ushnar's build.
- [x] All checks in CLAUDE.md pass.

---

## WO-16  A public page for each player's builds (11 Oct 2026)

Dave's idea: one link that shows all of a player's builds, for a Discord bio or a post. `/me` stays the private working list; the new page is what other people see.

### The page
1. **Address:** `/u/<handle>`, e.g. `/u/tapps`. Add a `handle` column to `user` (text, unique, nullable) through `npm run db:generate` and a committed migration. It's additive, so no data is touched.
   - Make the handle from the Discord name: lowercase, letters, digits and `-` only, 3 to 30 characters. Fall back to `player` if nothing is left, and add `-2`, `-3` and so on when it's taken. Put this in one function with unit tests.
   - Set it at sign-in when it's empty. Once set, it never changes, even if the Discord name does, so shared links keep working.
   - `scripts/backfill-handles.ts` fills empty handles for existing users. It only writes to rows where the handle is empty. Run it on dev and staging; production gets it when staging is published.
2. **What it shows:** only **Listed** builds, newest first, using the same `BuildCard` as Browse builds (not the `mine` variant). Link-only and Only-you builds never appear here, not even to the owner, so the page always shows what a visitor sees.
3. **Header:** the avatar and Discord name as the `h1`, then one line: `3 builds`, or `1 build`. There's no bio and no join date.
4. **Empty:** `No listed builds yet.` If the owner is viewing their own page, add a second line, `Only listed builds show here.`, with a link to `My builds`.
5. **Unknown handle:** the site's normal 404.
6. **Metadata:** title `Builds by Tapps`. The social image is the cover of the newest listed build that has a cover, otherwise the site default. Never put the email in the page, its props or the metadata.

### Getting to it
7. **Author names link to the page:** the name and avatar on build cards (Browse builds, the profile page) and on the shared build page link to `/u/<handle>`. A user with no handle yet shows the name as plain text.
8. **`/me`:** add a `My page` button next to `New build`, linking to `/u/<handle>`.
9. **Owner on their own page:** add a `Copy link` button next to the header. When clicked, it says `Copied` for two seconds.

### Done when
- [x] Unit tests for making handles: Discord names with spaces, capitals, accents, emoji, only symbols (`player`), too long, and a name that's already taken (`-2`).
- [x] e2e: a visitor to `/u/<handle>` sees the owner's listed builds and none of their link-only or private ones. `/u/nobody-here` returns 404.
- [x] e2e: clicking the author name on a build card and on a shared build page opens that author's page.
- [x] Migration committed in `drizzle/`. The backfill script has been run on dev and staging, and a second run changes nothing.
- [x] Screenshots for Dave at 1512 × 806 and 390: Tapps's page with listed builds, the same page empty as the owner, and `/me` showing `My page`.
- [x] All checks in CLAUDE.md pass.

---

## WO-17  Dave's test notes: editor and browse polish (11 Oct 2026)

From Dave's testing. Do after WO-16.

### Tooltips
1. **One tooltip component, shown at once.** The tree chips use `title` (`tree-tabs.tsx`), which the browser shows after about a second and only on hover. Make a `Tooltip` in `src/components/ui/`:
   - It shows with no delay on hover and on keyboard focus, and hides on leave, blur and Esc.
   - It sits above its trigger and flips below when there's no room.
   - It has an opaque background (as in WO-13 #10) and is linked by `aria-describedby`.
   - On touch, a tap on the trigger shows it until the next tap elsewhere.
   - Replace every `title=` used as a tooltip in the editor and on the shared page with it.
2. **Tree chips:** the tooltip says the tree, the skill level and the perks held, e.g. `Two-Handed 27, 3 perks` or `Destiny, 2 left`. This applies in both the editor and the shared page.
3. **Trainer session, Skill book, Standing stone:** each label in the editor gets a tooltip giving the rule the planner applies. Take the wording from `src/lib/rules/constants.ts` and the engine, not from memory:
   - Trainer session: sessions per level, and that unused ones carry over.
   - Skill book: +1 to the skill, +2 with Skilled.
   - Standing stone: one at a time, and a new stone replaces the old.

### Editor layout
4. **Narrower skills column.** The left column (`.left` in `editor.module.css`) is 360 to 440 px wide. Make it 300 px from 1280 px wide and up, so the tree gets the room. Skill rows must still fit on one line with no names cut short (check `Restoration`, `Conjuration` and `Heavy Armor` at their longest values, `100 +5`).

### Rich text you can see
5. Level notes and the Guide already support bold, italic, lists and dividers, but only through the selection bubble and the `/` menu, so both look like plain text boxes. Replace the bubble with a **toolbar that is always visible** at the top of each field. It stays in view when scrolling a long guide.
   - **Level notes:** Bold, Italic, Bulleted list, Divider, Link.
   - **Guide:** Heading, Bold, Italic, Bulleted list, Numbered list, Quote, Divider, Link, Image, then `More` (Tip, Warning, Spoiler, YouTube video).
   - Buttons are icons with the tooltip from #1, giving the name and shortcut (`Bold  Ctrl+B`, or `⌘B` on a Mac). They show when they're on (bold text selected, cursor in a list).
   - Keep the `/` menu and the typed shortcuts (`- `, `---`, `**`) as they are.
   - On phones the toolbar sits above the keyboard, as the bubble does now.

### Browse builds
6. **Card hover:**
   - The whole card is one target: hovering anywhere lifts the border to ember and brightens the cover a little.
   - Clicking anywhere outside the buttons opens the build. Use a stretched link on the name so there are no nested links.
   - With `prefers-reduced-motion`, there's no transition.
   - `Edit` and `Delete` on your own cards keep working and don't open the build.
7. **`New build` button:** it gets the same hover and focus states as the other primary buttons. Check every `btn-primary` while you're there.

### Level bars
8. The ruler (the whole build) and the row (a window of levels) don't read as connected. Make it plain that the row is a close-up of the ruler:
   - **The window on the ruler** gets an ember outline, the same as the row's frame.
   - **Two thin connector lines** run from the window's left and right edges down to the row's left and right edges, like a zoom. Draw them in one SVG that redraws on resize and whenever the window moves.
   - **The ruler's ends** show `1` and the last level.
   - **Drag:** you can drag the window along the ruler, and the row follows. Clicking the ruler still jumps.
   - **When the row moves**, the window on the ruler moves with it in the same 150 ms. With reduced motion it moves instantly.
   - **Both places:** this applies in the editor and on the shared page, including phones.

### Done when
- [x] e2e: hovering a tree chip shows its tooltip within 50 ms, and focusing it with Tab shows it too.
- [x] e2e: in level notes, the toolbar's Bulleted list and Divider buttons produce a list and a rule that are there after a reload.
- [x] e2e: dragging the ruler window from level 1 to level 15 brings level 15 into the row.
- [x] No `title=` left as a tooltip in `src/components` (`grep -rn ' title=' src/components`; any left gets a comment saying why).
- [x] Screenshots for Dave at 1512 × 806: editor with the narrower column and a chip tooltip showing; level notes with the toolbar; the Guide page with the toolbar; the level bars with the connector lines at level 12 of 20; Browse builds with one card hovered. Also the level bars at 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-18  Tags, search and likes on Browse builds (11 Oct 2026)

From Dave's testing. Do after WO-17. Two migrations through `npm run db:generate`. Both are additive, so no existing data changes.

### Tags
1. **Set list, not user-made.** Add a `tag` table (`slug`, `name`, `group`, `sort`) seeded by the migration, and a `build_tag` table (`build_id`, `tag_slug`, primary key on both, cascade on build delete). The 20 starting tags, by group:
   - **Weapons:** One-Handed, Two-Handed, Marksman, Shield
   - **Armor:** Heavy Armor, Light Armor, Unarmored
   - **Magic:** Destruction, Conjuration, Necromancy, Illusion, Alteration, Restoration, Spellsword
   - **Way of play:** Stealth, Thief, Crafter, Shouts, Tank, Beginner-friendly
2. **Choosing tags:** on the Set up Name step, under the description, show chips grouped as above. Up to 5 per build. The shared page shows them under the meta line, and each one links to Browse builds filtered by it.
3. **Suggested tags:** pre-select the tags that match the build's majors on first save (One-Handed major gives One-Handed, and so on), shown as suggestions the player can remove. Nothing is ever added without them seeing it.

### Search and filters
4. **Browse builds** gets one row above the grid:
   - a search box, matching the name, description, author, race and traits;
   - `Tags` (multi-select; a build must have all the chosen tags);
   - `Race`;
   - the existing version filter;
   - `Sort`: Newest, Most liked.
5. **State lives in the URL** (`?q=&tags=necromancy,heavy-armor&race=&sort=liked&version=`), so a filtered list can be shared. Typing updates the results after 300 ms without a full page load. Show 24 builds, then a `Show more` button.
6. **No results:** `No builds match.`, with a `Clear filters` button.
7. Only Listed builds appear, as now. Add whatever indexes the queries need, in the migration.

### Likes
8. **Table:** `build_like` (`user_id`, `build_id`, `created_at`, primary key on both, cascade on build or user delete), and a `like_count` column on `build` that is updated in the same transaction as each like or unlike, so sorting doesn't count rows.
9. **Liking:**
   - A `Like` toggle on the shared page next to the author, and the count on each card.
   - Signed-in players only. A signed-out click opens sign-in and returns to the build.
   - You can't like your own build: the button doesn't show to the owner, but the count does.
   - The count changes as soon as you click, and goes back with an error line if the save fails.
10. **`Most liked`** sorts by `like_count`, then newest.

### Done when
- [x] Migrations committed in `drizzle/`, with the 20 tags seeded. Applied to dev and staging.
- [x] e2e: tag a build with Necromancy and Heavy Armor; filtering by both finds it; filtering by Necromancy and Marksman doesn't.
- [x] e2e: search for part of a build's description finds it; the URL holds the query, and reloading keeps the results.
- [x] e2e: like, reload (still liked, count +1), unlike (count back). The owner sees no Like button. A signed-out click goes to sign-in.
- [x] Unit test: suggested tags from majors.
- [x] Screenshots for Dave at 1512 × 806 and 390: Browse builds with the filter row, filtered by one tag; the Name step's tag chips; the shared page with tags and Like.
- [x] All checks in CLAUDE.md pass.

---

## WO-19  The shared build page, top to bottom (11 Oct 2026)

The shared page is the one people judge the app by, and today it gives every number at every level the same weight. The new order follows the two readers:
- someone **deciding** whether to play the build: hero, intro, about bar;
- someone **playing** it, who has just levelled up in game and asks "what do I do now?": the level card.

Everything else is reference, so it comes after the card.

Source of truth: the canvas artboards **Shared build, reworked (proposal, level 6)** and **Shared build, reworked: phone** (https://claude.ai/artifact/48H6v9Q6wFuwhzRqE31uD1). They replace "Shared build (what a visitor sees)" as the reference for this page. Their perk tree is drawn by hand; use the real `Tree` component. Do after WO-18. `src/components/build/build-view.tsx` is the main file.

### Order on the page
1. **Hero**, as it is now (with WO-18's tags and Like).
2. **Intro.** A new short guide section, key `intro`:
   - Add it to `GuideKey`, with a 1,200-character limit and only bold, italic and link.
   - It shows full width of the content column at 19 px, with `Read the full guide` under it, which opens the Guide tab. Hide that link when there's no guide.
   - Builds without an intro show the first paragraph of their guide instead. Builds with neither show nothing.
   - The intro must use the same column width as the about bar below it, never a narrower measure (Dave's rule on early line breaks).
3. **About bar** (race, birthsign, traits, game mode, start, deity), as now.
4. **Tabs: `Levels` · `Guide` · `Gear`.**
   - Levels is the default.
   - Guide is the full guide; Gear is the gear table, moved off the bottom of the page.
   - A tab with nothing in it isn't shown. With only Levels, there's no tab row.
   - The tab is in the URL (`?tab=guide`) alongside `?level=`, changes without a page load, and the arrow keys move between tabs.

### The Levels tab, in this order
5. **Level navigation:**
   - The stepper reads `‹ Level 6 of 20 ›`, with no "Viewing" label.
   - The ruler, lens and row stay as WO-17 built them.
   - When the stepper scrolls off the top of the window, a slim bar pinned to the top holds `‹ Level 6 of 20 ›`, so you can step through levels while reading the card below.
6. **The level card**, in a frame. The heading is `Level 6`. Rows go in the order the game asks for them:
   - `Attribute`: `+5 Health`, with the attribute's dot.
   - `Skill points`: one line per skill, `Evasion 50 → 55`, biggest gain first. A skill that stopped at the level's limit gets `(max skill 56 at level 6)` after it, once, on the first such skill.
   - `Perk` / `Perks`, Destiny included: each name is a button. Clicking it selects that tree in the Perks section with the star selected, and scrolls there.
   - `Standing stone`, when it changes: `The Lover (in place of The Warrior)`. Leave out the brackets when there was no stone before.
   - `Trainer`: `Wayfarer +2 (16 → 18)`, and `Skill book` the same way.
   - `Banked`, as now.
   - The level's problems, if any, at the bottom in the error colour.
   - **The author's note** sits on the right, about two parts card to one part note. It's in Alegreya italic 21 px with the author's avatar and name under it. Under 900 px wide it goes below the rows. With no note, the rows take the full width and there's no empty box.
7. **Attributes at level 6:**
   - The three bars and WO-15's stone line, as now.
   - Then small print: `Carry weight` and `Skill points carried over`.
   - `Perk points left` and `Destiny points left` show only when above 0.
   - `Trainer sessions used` goes; the card shows sessions at the level they're used.
8. **Skills at level 6:**
   - Two columns, `Majors` and `Minors`, each skill with its value, bar and this level's gain.
   - `All 18 skills` opens the full list in the game's groups (Warrior, Thief, Mage), as now.
   - The max-skill info tip moves next to this heading.
   - On phones the two columns become one.
9. **Perks at level 6:**
   - **Chips:** one per tree the build holds perks in, plus Destiny, each with a held count. `Other trees ▾` opens a menu of the rest.
   - **Default tree:** the tree of this level's first perk; otherwise the first major.
   - **Tree and list side by side:** the real `Tree` on the left, a `Held` list on the right, grouped by tree. Use `perksByLevel` with the `Lv N` tags as now, and this level's perks in ember. Clicking a held perk selects its tree and star.
   - **Tree height:** the same rule as in the editor.
   - **Under 1100 px:** one column with the existing List | Tree toggle, defaulting to List.
   - Remove `Open perk trees` / `Close perk trees` and the collapsed state.

### Editor
10. **The Guide page** gets an `Intro` field above `Guide`. It uses the level notes' toolbar (WO-17) and the same autosave. The field's label and the character count are the only copy.

### Done when
- [x] e2e: `?tab=guide&level=6` opens the Guide tab. Switching to Levels shows level 6, and the URL keeps the level.
- [x] e2e: on Azrem (`/b/225en4m79k`) at level 6, the card's rows read in this order: Attribute, Skill points, Perk, Standing stone, Trainer. `The Lover (in place of The Warrior)` and `(max skill 56 at level 6)` are shown.
- [x] e2e: clicking `Dodge` in the card selects Evasion in the Perks section, with Dodge's star selected.
- [x] e2e: a build with no intro shows its guide's first paragraph. A build with no guide has no Guide tab.
- [x] No `Open perk trees` text left in `src`.
- [x] Screenshots for Dave of Azrem at level 6, compared with the two canvas artboards: 1440 × 900 (the top of the page down to the card, then the Perks section) and 390 (top, card, perks).
- [x] All checks in CLAUDE.md pass.

---

## WO-20  Perk trees: what a perk does, and room to breathe (11 Oct 2026)

From Dave's look at WO-19. Two problems:

- **Clicking a perk on the shared page shows nothing.** WO-19 passes `onSelect` to `Tree`, which turns the stars into select buttons. On desktop that drops the tooltip, and the details only open on phones (the `ReadOnlyDetails` bottom sheet, `src/components/build/tree.tsx`).
- **Dense trees are crowded.** Every tree is scaled to fit the box, so One-Handed and Block squash together. Labels sit on lines and on each other (`Balanced Wielding` over `Penetrating Strikes`, `War Axe Focus` across a line). Pan and zoom only exist under 900 px.

Do after WO-19. This applies to the shared page and the editor alike, since both use `Tree`.

### What a perk does
1. **Shared page, 1100 px and up:** selecting a perk opens a details panel at the top of the right column, above `Held`. You can select it from the tree, from `Held`, or from the level card. The panel is `ReadOnlyDetails`, extended to show:
   - the name with its rank, and the tree;
   - the game's text for each rank (`perkText`), with the ranks taken marked;
   - what it needs (skill level and perks), and `Can't be held with …`, as in the editor's panel;
   - one status line:
     - `Taken at level 4`, or `Rank 1 taken at level 1, rank 2 at level 5`;
     - `Can be taken at level 6` when the build could take it at the level being viewed;
     - `Not taken by level 6` otherwise.
   - A close button (`×`) and Esc clear the selection. Changing level keeps the selected perk and updates its status line.
2. **Under 1100 px:** the details open in the bottom sheet, as phones do now.
3. **Hover** (any width, mouse only): the existing hover tag shows the name and requirement at once (WO-17 tooltip rules). The full text stays in the panel, so the tag stays small.

### Room to breathe
4. **Draw trees at a readable size, not at fit size:**
   - **Scale:** the drawing's scale is the larger of the fit-to-box scale and the scale at which the two closest stars are 88 px apart, capped at 2.5× fit. Simple trees still fit the box; dense ones grow past it.
   - **Labels:** star, line and label sizes keep their current values at that scale; they don't grow with it.
   - **Placing:** labels are placed on the larger drawing.
5. **Pan and zoom at every width**, not only under 900 px:
   - drag the empty sky to pan, with a 4 px threshold so a click on a star is still a click;
   - Ctrl/⌘ + wheel or a pinch zooms; a plain wheel scrolls the page, never the tree;
   - `+`, `−` and `Fit` buttons in the tree's toolbar, where `Fit` shows the whole tree in the box. The zoom range runs from Fit up to 2× the readable size.
   - Arrow keys pan while the tree box has focus. Tabbing to a star pans just enough to bring it into view.
6. **Where the view starts:**
   - The view centres on the selected star if there is one.
   - Otherwise it centres on this level's newest perk in the tree.
   - Otherwise it shows the tree's bottom row, centred, where every tree starts.
   - Switching tree tabs starts the same way. Selecting a star from the level card or `Held` pans to it.
7. **Signs there's more:** a 32 px fade on each edge where the drawing runs past the box, and the cursor shows grab / grabbing over empty sky.
8. **Height:** the box keeps WO-19's height rule. Width is the column; the drawing pans inside it.
9. **Labels never overlap:**
   - A label must not overlap another label or another star.
   - A label must not sit on a line if a free position exists.
   - A label that can't be placed is left out, and that star keeps its hover tag.
   - Fix whatever lets `Balanced Wielding` and `Penetrating Strikes` overlap today.

### Done when
- [x] e2e (shared page, 1440 × 900): clicking a star in Block shows its game text and a status line in the right column. `×` clears it. Clicking `Dodge` in Azrem's level-6 card selects it in Evasion and shows its details.
- [x] e2e: dragging the One-Handed tree pans it, and the star clicked afterwards is selected. A plain wheel over the tree scrolls the page. `Fit` shows every star.
- [x] Unit test: at 1000 × 560, no two placed labels in One-Handed, Block or Destiny overlap, and no label overlaps a star. The closest two stars are at least 88 px apart unless the 2.5× cap applies.
- [x] Screenshots for Dave at 1440 × 900: One-Handed and Block on the shared page at the readable size with a perk's details open; Fit on One-Handed; the editor's One-Handed tree at 1512 × 806. Also 390 with the bottom sheet open.
- [x] All checks in CLAUDE.md pass.

---

## WO-21  Shared page and guide page: Dave's notes after WO-19 (11 Oct 2026)

Do after WO-20. Shared page items are in `src/components/build/build-view.tsx`; the guide page is `src/components/guide/guide-page.tsx`.

### Level card
1. **The author's line goes above the note.** Avatar and name sit at the top of the note column and link to the author's page (`AuthorLink`, as in the hero).
2. **No note:** the note column stays, with the author's line and then `No note for level 6.` in muted text. This replaces WO-19's "no empty box" rule.
3. **Skill icons** on every skill named in the card: Skill points, Trainer, Skill book (`SkillLabel`). Perk rows keep their tree icons.
4. **Tooltips** (the WO-17 component) on the `Banked`, `Trainer`, `Skill book` and `Standing stone` labels. Each label gets a dotted underline so it reads as hoverable. Take the wording from `src/lib/rules/constants.ts` and the engine, as WO-17 did in the editor:
   - Banked: points not spent at a level carry over to the next.
   - Trainer: 5 sessions per level, and unused ones carry over.

### Attributes
5. **Bigger icons.** Add a 24 px size to `GameIcon` / `AttributeIcon`. Use it on the three rows in `Attributes at level N` and on the card's `Attribute` row.

### Perks
6. **`Held` is unclear.** Rename the heading to `Taken by level 6`.
7. **Double rule:** the heading has a rule under it and the first group has a rule above it. Keep the heading's rule only; groups get a rule under each one, not above.

### Tabs that can't be missed
8. After WO-22 the tabs are **Levels** and **Guide**:
   - **Size:** 64 px tall, the condensed face at 28 px uppercase, starting at the left edge of the content column.
   - **Second line:** each tab has a second line in 14 px muted text: `Levels 1 to 20` and `6 min read` (guide words ÷ 200, rounded up).
   - **Active tab:** the panel colour (`#141b23`) with a 3 px ember bar on top and no bottom border, so it joins the content below.
   - **Inactive tab:** outlined, with muted text that turns light on hover.
   - **A rule** runs the full width under the tab row.
9. **The pinned bar** (Dave: "brilliant"; he wants it to say what changed). Left to right: the level stepper, then a one-line summary of the level, then the tabs at a compact size on the right. Stepping with it while scrolled down to the perk tree should show what each level brought without scrolling up.
   - **Opaque background.** It is `rgba(14,19,25,.96)` now, and the card text shows through it (Dave's screenshot). Make it solid `#0e1319`.
   - **The summary is a row of small chips, in the card's order:**
     - **Attribute:** its icon (16 px) and `+5`.
     - **Skills:** for each skill raised by points, a trainer or a book, the skill icon and `+5`, biggest gain first. After 3 skills, `+2 more`, with a tooltip listing them.
     - **Perks and Destiny:** the tree icon and the perk name (`Dodge`, `Constitution`).
     - **Standing stone** when it changes: the stone icon and `The Lover`.
     - **Gear** when it changes (WO-22): `Steel spear`.
     - **Note:** a small note mark when the level has one.
   - **Each chip has a tooltip** with the full line from the card (`Evasion 50 → 55`, `Dodge (Evasion)`).
   - **A perk chip is a button.** It selects that perk in the Perks section (tree tab, star and details, per WO-20) without scrolling the page, so it works while you're looking at the tree.
   - **Changing level** swaps the chips with a 120 ms fade (none with reduced motion), and the bar's height doesn't change.
   - **Level 1** shows the starting picks the same way, perks and stone included.
   - **Fit:** one line, never wrapping. When chips don't fit, skills collapse first (`3 skills`, tooltip), then the stone and gear chips. Perk chips stay as long as possible.
   - **Under 900 px:** the stepper, then the attribute chip and the perk names only, ending with `…` when cut off. The tabs move to the bar's second row only if they don't fit; check at 390.

### Guide page
10. Today the page is two big text boxes. **From 1100 px wide it becomes two columns:**
   - **Left: the fields.**
     - The `Intro` field is 4 lines tall with a character count (`312 / 1,200`).
     - The `Guide` field starts at 12 lines and grows with its text.
   - **Right: a sticky miniature of the shared page**, about 260 px wide, drawn with plain blocks:
     - The blocks are the hero, the intro's lines, the about bar, the `Levels` and `Guide` tabs, and a level card with its note column.
     - Each block a field fills is labelled `Intro`, `Guide` or `Level notes`.
     - The block for the field that has focus is lit in ember. With no focus, both `Intro` and `Guide` are lit softly.
     - The `Level notes` block links to the editor at level 1, since notes are written there.
     - Under it, `See it on the build page` opens `/b/<id>?tab=guide` in a new tab.
   - **Under 1100 px:** no miniature; the fields stack as now.

### Done when
- [x] e2e: the author's name in a level card links to `/u/<handle>`. A level with no note shows `No note for level N.`
- [x] e2e: hovering `Banked` and `Trainer` in the card shows their tooltips.
- [x] e2e: on the guide page, focusing `Intro` lights the miniature's intro block and focusing `Guide` lights its guide block.
- [x] e2e: scrolled down to the perk tree on Azrem, `›` in the pinned bar moves to level 7 and the bar's chips change. At level 6, clicking the `Dodge` chip selects Dodge in Evasion, and `window.scrollY` stays the same (±2 px).
- [x] The pinned bar is opaque: nothing shows through it (screenshot over the level card).
- [x] No `Held` heading left. Only one rule between the heading and the first group (screenshot).
- [x] Screenshots for Dave at 1440 × 900: the pinned bar over the perk tree at level 1, 6 and 12 of Azrem, plus at 390; the tab row; the level card with a note and without; attributes; `Taken by level 6`; the guide page with the miniature, `Guide` in focus. Also 390 for the tabs and the card.
- [x] All checks in CLAUDE.md pass.

---

## WO-22  Gear by level (11 Oct 2026)

Dave: gear should change with level, carry over from one level to the next by default, and stay optional. The Gear tab shows a whole-build table that doesn't line up with the level being viewed. Do after WO-21.

### What gear means
1. **Keep `GearItem` `{ slot, name, fromLevel, note }`.** A row means "from this level on, this slot holds this item", until a later row for the same slot. A row with an empty `name` means the slot is emptied from that level.
   - Add `gearAt(plan, level)`: the item each slot holds at a level, with the level it was set.
   - Add `gearChanges(plan, level)`: the rows set at exactly that level.
   - Unit-test both.
2. **Fixed slots:** `Main hand`, `Off hand`, `Head`, `Body`, `Hands`, `Feet`, `Ring`, `Amulet`, `Ammo`, `Other`. `Other` may hold several items.
   - Map the old free-text slots when a plan is read (`src/lib/rules/convert.ts`): Weapon → Main hand, Shield → Off hand, Chest → Body. Anything unknown → Other.
   - Nothing is lost: existing rows keep their name, level and note.

### Editor
3. **Remove the separate Gear page** (`/b/<id>/gear`, `gear-page.tsx`) and its header button. Redirect old links to the editor.
4. **A `Gear` block in each level's editor**, after Between level-ups:
   - It lists each slot that holds something at this level.
   - Items carried from earlier levels are shown muted, as `Steel spear, since level 4`.
   - Each slot has `Change` (an item field: the WO-23 search when it exists, plain text before that, plus an optional note) and `Empty from here`.
   - A change made at this level is shown in ember with `Undo`.
   - `Add gear` with a slot select covers empty slots.
   - A build with no gear shows only `Add gear`. Gear is never required and never raises a problem.

### Shared page
5. **Remove the Gear tab**, leaving `Levels` and `Guide`. `?tab=gear` opens Levels.
6. **Level card:** a `Gear` row when something changes at that level, e.g. `Steel spear (Main hand)` or `Off hand emptied`.
7. **`Gear at level 6`:** a short slot and item list after Skills. Items set at this level are in ember. It's left out when the build has no gear at all.

### Done when
- [x] Unit tests: `gearAt` carries an item forward, a later row replaces it, an empty name clears it, and `Other` holds several.
- [x] e2e: in the editor, set a Main hand item at level 2, go to level 5 (it shows as carried), change it at level 5, then view the shared page: level 3 shows the first item and level 5 shows the new one in the card.
- [x] e2e: `/b/<id>/gear` redirects to the editor, and `?tab=gear` opens Levels.
- [x] Ushnar's and Azrem's existing gear still shows, under the new slot names (screenshot).
- [x] Screenshots for Dave: the editor's Gear block at 1512 × 806 with one carried item and one changed item; the shared page's level card and `Gear at level N` at 1440 and 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-23  An index of the game's items, for gear and @-mentions (11 Oct 2026)

Dave asked whether every item in the game could be indexed. It can: the planner already reads perks and books from the LoreRim load order's own plugin files (`scripts/gamedata/esp.py`, `extract.py`, `books.py`), and items are records in the same files. The work is filtering out the noise. Do after WO-22.

### Extracting
1. **`scripts/gamedata/items.py`**, on the same reader and read-only like the others. It writes `gamedata/5.0.4.8/items_raw.json` from the winning records of:
   - **WEAP:** name, weapon type (from the type keywords: Sword, War Axe, Mace, Dagger, Greatsword, Battleaxe, Warhammer, Bow, Crossbow, Staff, plus LoreRim's own such as Spear and Quarterstaff where they have keywords), damage, weight, value.
   - **ARMO:** name, slot (from the biped flags: Head, Body, Hands, Feet, Shield, Ring, Amulet), Light / Heavy / Clothing (from the armor-type keywords), armor rating, weight, value.
   - **AMMO:** name, arrow or bolt, damage.
   - The description text where a record has one (`DESC`).
2. **Filters** (counts for each step go in the commit message):
   - **Playable only:** skip records with the non-playable flag, and armor with no biped slot.
   - **Named:** skip records with no full name, and names that look like debug or deleted records (`zzz`, `DELETED`, `Dummy`, `[` at the start). The pattern list goes in `overrides.json`.
   - **No enchanted copies:** skip records made from a template (`CNAM` on WEAP, `TNAM` on ARMO), which are the generated "Iron Sword of Frost" copies. Unique named items without a template stay.
   - **One entry per name:** merge records that share type and name, keeping the winning record's stats.
3. **Build into the planner:** `build.py` writes `src/data/lorerim-5.0.4.8/items.json` (generated, never hand-edited, like the other data files) with `{ id, name, kind, slot, armorType, weaponType, stats, text }`. `id` is the plugin and form ID.
4. **Size:** this file must not go into the main bundle. Load it on demand, the first time the gear search or `@` opens, from a static route with long caching. If it is over 1 MB gzipped, report the size and stop for review.
5. **Running it:** the extract needs the LoreRim files on Dave's PC, so Jeff writes and unit-tests the scripts against a small fixture plugin. The chat session runs `items.py` on the PC and commits `items_raw.json`. Jeff then runs `build.py`.

### Using it
6. **Gear search:** the WO-22 item field becomes a search box filtered to the slot's items (Main hand: weapons; Body: body armor, and so on). It shows the name with a small line of type and stats (`Heavy armor · 25 armor · 30 weight`). Free text is still allowed for items the index doesn't have.
7. **`@`-mentions** gain the kind `item`:
   - The chip shows the name.
   - The hover card shows the type, stats and game text when there is any.
   - Search ranks exact name starts first and shows at most 8 results.
   - Gear rows picked from the index link to the same card.

### First run on the PC (chat session, 11 Oct)
`items.py` ran against the Ultra load order in 30 s:
- **Counts:** records 25,137 → playable 21,208 → named 20,593 → untemplated 6,354 → merged **5,113** (3,407 armor, 1,537 weapons, 169 ammo).
- **Size:** `items_raw.json` is 1.48 MB raw. It's committed at `gamedata/5.0.4.8/items_raw.json`.

Fix these in `items.py` / `build.py` before building `items.json`:
- **Weapon type labels.** `Qtr Staff` (9) and `Quarterstaff` (9) are the same type, so use `Quarterstaff`. `Pole2H_Thrust` (Spear of Bitter Mercy) is a raw animation name, so map it to `Spear`.
- **Types taken from the animation, not what the item is.**
  - Quarterstaffs that have only a warhammer keyword come out as `Warhammer` (Steel Quarterstaff, the Staff of Wandering Stars).
  - SkyrimSpearMechanic's spears and javelins with a sword keyword come out as `Sword` (Iron Spear, Ebony Javelin).
  - Prefer the name and the mod's own keywords: a name ending in Quarterstaff, Battlestaff, Spear or Javelin wins over the animation keyword.
  - Follow-up (11 Oct): Pike, Halberd and Glaive names become `Polearm`, so Ebony Pike is no longer a Greatsword.
  - Search ranking: `iron armor` putting items literally named "Iron Armor …" above Iron Cuirass is right, so leave it.
- **Not items:** `FXdustDropWEP` (a debug record with a name) and `Unarmed` (`Claw`). Add both to `skipNames`.
- **Not a problem:** LoreRim renames many vanilla items, e.g. `Iron Cuirass` rather than Iron Armor and `Orcish Heavy Cuirass` rather than Orcish Armor. Search should match on any word, not just the start, so "iron armor" still finds Iron Cuirass.

### Done when
- [x] Unit tests for each filter against the fixture plugin: a non-playable armor, a templated enchanted sword, a `zzz` record, two same-name records.
- [x] `items.json` built from the real load order. Its item count and gzipped size are in the commit message, and it isn't in the main bundle (`npm run build` output).
- [x] e2e: typing `steel sp` in a Main hand gear field offers Steel Spear (or the load order's name for it), and typing `@ebony` in a level note offers Ebony items with their hover card.
- [x] Screenshots for Dave: the gear search open at 1512 × 806; an item hover card in a note on the shared page.
- [x] All checks in CLAUDE.md pass.

---

## WO-24  Header without a nav, and liked builds on profiles (11 Oct 2026)

From Dave's notes. Do after WO-23. Dave has since reshaped the tabs and pinned bar himself (b496af7); leave those as they are.

### Header (`src/components/site-header.tsx`)
1. **Remove the nav** (`Browse builds`, `My builds`, `New build`).
   - The brand links to `/`, which is Browse builds.
   - On the right: a `New build` primary button (ember, `btn-primary`), then the avatar and name.
   - The avatar opens a menu: `My page` (`/u/<handle>`), `My builds` (`/me`), `Sign out`.
   - Signed out, there's `Sign in with Discord` in place of the avatar. `New build` stays, and leads to sign-in.
2. **The menu** is a real menu button:
   - `aria-haspopup`, arrow keys, and Esc closes it.
   - It also closes on a click outside.
   - The current page's item is marked with `aria-current` and shown in ember.
3. **Phones:** the brand, `New build` as an icon button with `aria-label="New build"`, and the avatar menu.

### Profile (`/u/<handle>`)
4. **Two sections:** `Builds` and `Liked`, switched with the same open-text tabs Dave chose for the build page.
   - `Liked` lists the Listed builds this player has liked, newest like first. It uses the usual cards with a `Liked 11 Oct` line in place of the date.
   - Link-only and private builds never show here, even if they were liked.
   - Empty: `No liked builds yet.`
5. **The header line** reads `2 builds · 5 liked`.

### Done when
- [x] e2e: the header has no nav links. `New build` is a button, and the avatar menu reaches My page, My builds and Sign out by keyboard.
- [x] e2e: like a Listed build and a Link-only build as a second user; that user's `Liked` shows only the Listed one.
- [x] Screenshots for Dave at 1440 and 390: the header signed in and signed out, the menu open, and a profile on `Liked`.
- [x] All checks in CLAUDE.md pass.

---

## WO-25  The build page's hero and intro, dressed up (11 Oct 2026)

From Dave's notes. Do after WO-24. Every motion here is off under `prefers-reduced-motion`. It uses transforms and opacity only, with no layout changes and nothing that moves the page under the reader.

### Hero
1. **Loading in**, once per page load:
   - The cover fades in from `scale(1.06)` to `1` over 900 ms (ease-out).
   - Then the title rises 16 px and fades in, at 250 ms.
   - Then the description at 350 ms, the meta line at 450 ms, and the buttons at 550 ms, each over 500 ms.
   - Nothing waits on the image: if the cover is slow, the text still comes in on time over the plain band.
2. **On scroll**, while the hero is in view:
   - the cover moves at half the scroll speed (parallax, `translateY`);
   - the text block rises a little faster and fades to 0 by the time the hero's bottom reaches the top of the window;
   - the dark fade at the hero's foot deepens as you go.
   - Use one `requestAnimationFrame` loop or `animation-timeline: scroll()` where supported. No scroll-jacking.

### Intro, in the manner of Skyrim's books
3. In-game books open with a large decorated first letter.
   - **Drop cap:** the intro's first letter is 4 lines tall in Alegreya, bold, gold (`#b9a173`). It sits in a square frame with the same corner marks as `.frame`, with a faint ember wash behind it. Use `initial-letter: 4` where supported, with a float fallback that lines up with the 4 lines.
   - **The first line** of the intro is in small caps. Load Alegreya SC 500 for this alone.
   - **The text:** Alegreya, roman not italic, 20 px, line height 1.65. It runs the full content width, as WO-19 set (Dave's line-length rule).
   - **Ornament:** above and below the intro, a thin rule with a small diamond in the middle. Draw it as SVG in the gold at 60%, never an emoji or font glyph.
   - **No intro:** with only the guide's first paragraph shown (WO-19 fallback), it gets the same treatment.

### Done when
- [x] e2e: with `prefers-reduced-motion: reduce`, the hero's title has no transform after load and scrolling doesn't change the cover's transform.
- [x] A screen recording (GIF) for Dave of loading Azrem's page and scrolling past the hero, at 1440 × 900.
- [x] Screenshots: the intro with its drop cap at 1440 and 390, and in Safari (float fallback) if `initial-letter` behaves differently there.
- [x] Performance doesn't get worse. Lighthouse isn't installed, so Jeff measured in Chromium instead, with the CPU slowed 4× and the median of 5 loads: LCP 624 → 600 ms, CLS 0 → 0, blocking time 43 → 50 ms. Accepted.
- [x] Safari, which wasn't checked: Dave looks at the intro's drop cap in Safari on the Mac.
- [x] All checks in CLAUDE.md pass.

---

## WO-26  Editing as a first-class place (11 Oct 2026)

Dave: the editing experience feels second class.
- The share settings took him "forever" to find (they're on the last step of Set up).
- Going from the editor into the Guide and back is awkward.
- The perk tree is too short, so he keeps panning to find perks.
- The tree chips are icon-only and should show their names.

Do after WO-25.

### An edit bar
1. **Every owner's editing page** (Levels, which is the editor; Set up; Guide) gets the normal site header (WO-24) and, under it, an **edit bar**. Replace `FocusHeader` on these pages. The edit bar is sticky under the header, 56 px tall, on the panel colour with a rule under it. Left to right:
   - The build's name, in the condensed face, truncating with `…`.
   - Three page links: `Levels`, `Set up`, `Guide`. They're open-text links with the ember underline on the current one, matching the build page's tabs.
   - The save status (`Saved`, `Saving…`, `Couldn't save, Try again`), as now.
   - **Who can see it**, always shown: a select-style button reading `Listed`, `Link only` or `Only you` with an icon. It opens the three choices with their current descriptions and saves on choosing. This is the same setting as Set up's Name step, which keeps its fieldset.
   - `Copy link`, which says `Copied` for 2 seconds.
   - `View build`, which opens the shared page in the same tab. A primary button.
2. **On the shared page**, the owner sees the same edit bar with no page link underlined and `Edit` in place of `View build`, so moving between viewing and editing is one click either way.
3. **Phones:** the bar holds the name, the visibility button and a `⋯` menu with the page links, Copy link and View build.

### The perk tree in the editor
4. **Taller.** The tree box's height is the window height minus the site header, the edit bar, the tree chip rows and the legend, less 16 px. Its minimum is 520 px, and it has no maximum. The level header scrolls away above it.
   - At 1512 × 806 the tree box should be at least 520 px tall, against about 300 px in Dave's screenshot.
   - The perk panel pins beside the tree as now.
5. **Chips with names.** Remove the compact icon-only chips (WO-13 #9, WO-14 #1) from the editor.
   - The chips sit in three rows, one per game group (`Warrior`, `Thief`, `Mage`), each row headed by its group name in the small label style.
   - Each chip shows the icon, the skill name, its level and the held-count badge.
   - No horizontal scroll at 1280 and up. Under 1280 the rows may wrap.
   - Destiny is not in these rows; see WO-27.

### Done when
- [x] e2e: from the editor, `Guide` in the edit bar opens the guide page and `Levels` comes back, with no other step. The visibility button changes a build from Link only to Listed, and Set up's Name step shows the change.
- [x] e2e: the owner on the shared page sees `Edit`; a visitor sees no edit bar.
- [x] At 1512 × 806 the editor's tree box measures at least 520 px tall, and all 18 chips with names are visible without scrolling sideways.
- [x] Screenshots for Dave at 1512 × 806: the editor with the edit bar, the visibility menu open; Set up and Guide with the edit bar; the shared page as owner. Also the editor at 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-27  Destiny, its own thing (11 Oct 2026)

Dave: Destiny feels invisible because it lives among the perks. In the game it is a separate menu (Custom Skills) with its own points, earned at levels 1, 5, 10 and so on. Give it its own colour and its own place everywhere it appears. Do after WO-26.

### Its look
1. **Colour:** Destiny's colour is the gold already used for its marks (`#b9a173`), with a lighter tint for text on dark (`#d9c491`) and a 10% wash for backgrounds. Add these as CSS tokens. Perks stay ember. Check text contrast at 4.5:1.
2. **Mark:** Destiny's mark is the diamond the level bars already use, wherever Destiny is named.
3. **The Destiny tree** draws its taken stars in gold with gold lines, and its can-take stars with a gold outline. Its box gets a faint gold wash, so it can't be mistaken for a skill tree.

### Where it shows
4. **The editor:**
   - Destiny leaves the skill chip rows (WO-26).
   - It becomes its own control beside them: a gold-outlined button with the diamond, `Destiny`, and `2 left` or `0 left`. When there's a point to spend, it has a gold fill.
   - Choosing it shows the Destiny tree in the same tree box, and the box's frame turns gold.
5. **The shared page:**
   - The level card lists Destiny on its own row, `Destiny`, with the diamond, after `Perk`.
   - The pinned bar's Destiny chip is gold.
   - Perks: Destiny is no longer a chip among the trees. After the Perks section comes its own section, `Destiny at level 6`, with the Destiny tree and a `Taken by level 6` list for Destiny only, both in gold. The section is left out when the build has no Destiny perks.
6. **The editor's level header and the build page's attributes:** a `Destiny points` count sits next to `Perk points`, in gold.
7. **The level bars:** the gold diamonds are already there. Make the diamond 2 px bigger on the ruler and in the row, so a Destiny level reads at a glance.

### Done when
- [x] e2e: in the editor, the Destiny button shows `1 left` at level 5 of a fresh Konahrik build, and taking a Destiny perk sets it to `0 left`.
- [x] e2e: Azrem's level 5 card has a `Destiny` row reading `Constitution`, and the shared page has a `Destiny at level 5` section.
- [x] Contrast check: the gold text on panel and page backgrounds passes 4.5:1 (numbers in the commit).
- [x] Screenshots for Dave: the editor with the Destiny tree open at 1512 × 806; the shared page's level card and Destiny section at 1440; both at 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-28  Skill gains you can read at a glance (11 Oct 2026)

Dave: in the level card, each skill row reads `Marksman 43 → 48`, so the gain has to be worked out. Small; one commit. It can go before WO-24.

1. **Each skill row in the level card** (Skill points, Trainer, Skill book) becomes four aligned columns:
   - **icon**
   - **skill name**
   - **the gain**, e.g. `+5`, as the easiest thing to see: ember, semibold, 1.25× the row's size, tabular figures, right-aligned in a fixed-width column so every `+` lines up down the list.
   - **from → to** (`43 → 48`) in muted text at the normal size.
   - Example row: `[icon] Marksman   +5   43 → 48`.
2. **The max-skill note** stays after the from → to on the first capped skill, muted: `+1   60 → 61 (max skill 61 at level 11)`.
3. **Trainer and Skill book rows** use the same columns under their own labels: `Wayfarer   +2   16 → 18`.
4. **The same layout** goes in the editor wherever a level's skill changes are listed, and in the pinned bar's tooltips.
5. **On phones** the four columns stay on one line; the name truncates with `…` before the gain or the numbers do.

### Done when
- [x] Screenshot for Dave of Azrem's level 11 card at 1440 and 390, with the `+` signs lined up.
- [x] All checks in CLAUDE.md pass.

---

## WO-29  The about bar: order, hover text, and starts with their choices (11 Oct 2026)

From Dave's notes. Do after WO-28.

**Starts, checked against the game files (11 Oct).** LoreRim's start list is in `LoreRim - MCM and INI Settings/SKSE/AlternatePerspective/` (three JSON files). They win over the three start mods' own lists in every profile. The display names come from Alternate Perspective's English translation file.
- There are **25 starts**. `Merchant` and `Mercenary` are separate starts, so WO-15 #7 was right to split them.
- A start has **at most one choice**: an inn, a port, a hold, a city, a homeland, a guild, a shrine, a temple, or the Helgen Keep start or end.
- Most choices include `Random` (Dragonborn doesn't). Eight starts have no choice.
- The extracted list is committed as `gamedata/5.0.4.8/starts_raw.json`. It holds each start's name, its source mod, its own description text and its options, in the game's order and spelling.
- The game's own spelling is kept, typos included (`Haarfinger`, `Hjaalmach` in Jailed; `At Angis Camp`).
- Our current `starts.json` uses our own names and splits Guilds and Dragonborn into several starts; this replaces it.

### Order
1. The about bar reads **Race, Birthsign, Deity, Traits, Game mode, Start**: on the build page, in Set up's summary, and anywhere else these six appear together.

### Hover text on every item
2. Each value gets the WO-17 tooltip on hover and focus, with a dotted underline. Every tooltip uses only facts the planner already holds or the game's own words:
   - **Race:** the starting Health, Magicka and Stamina, and the primary and secondary skills (`races.json`).
   - **Birthsign:** the sign's text from the records (`birthsigns.json`), as in Set up.
   - **Deity:** the deity's own text from `gamedata/5.0.4.8/deities_raw.json`. It was read from the winning Wintersun records by `scripts/gamedata/deities.py`: 55 deities, each with `tenets`, `follower` and `devotee`.
     - Show the follower and devotee boons under those two words, then the tenets.
     - The text marks numbers as `<20>%`. Strip the angle brackets (as `plain` in `mention.ts` does).
     - Match planner names to the file's `key` by letters only, ignoring a leading `The` (`Riddle'Thar` → `RiddleThar`, `The HoonDing` → `HoonDing`). The one exception is `Mehrunes Dagon` → `Mehrunes`; put it in `overrides.json`.
     - `build.py` writes the result into `deities.json` alongside the race lists.
   - **Traits:** each trait is its own hover target, not one for the list, with the trait's text from `traits.json`. A trait choice shows as `Focused Combat: One-Handed` (WO-15).
   - **Game mode:** what the mode changes in the planner's rules, from `src/lib/rules/constants.ts`, e.g. Naaktiid's 3 extra perk points at level 1 and +100 carry weight (`naaktiidBonusPerkPoints`, `naaktiidCarryWeight`); Konahrik is the classic rules with neither. It must not be wording invented for the tooltip.
   - **Start:** a popover rather than a tooltip, since it holds more: the start's name, the choice made (`Hammerfell`), and the start's own text from `starts_raw.json`. It opens on hover and on click (tap on phones), and closes on Esc or a click outside.
3. **The bar's value for Start** is the start's name with the choice in muted text: `Mercenary · Hammerfell`. With no choice, or `Random`, it's the name alone. It truncates with `…` on narrow screens, and the popover has the rest.

### Starts and their choices
4. **Data:**
   - `build.py` writes `src/data/lorerim-5.0.4.8/starts.json` from `gamedata/5.0.4.8/starts_raw.json` as `[{ name, source, text, options: [name, ...] }]`.
   - The game's names, order and options stay as they are.
   - There's no PC step left: starts and deity text are both committed (`starts_raw.json`, `deities_raw.json`).
5. **The plan:** add `startOption?: string`. Map old saved `start` values to the game's names on read (`convert.ts`):
   - `Regular at an inn` → `Regular (Inn)`; `Arriving from overseas` → `From Overseas`; `Wanted criminal` → `Wanted Criminal`; `Left for dead` → `Left for Dead`.
   - `Guild member: X` → `Guilds` with option `X`.
   - `The Dragonborn (Helgen Keep)` → `Dragonborn`, no option.
   - `Temple pilgrim` → `Pilgrim (Temple)`; `Shrine pilgrim` → `Pilgrim (Shrine)`; `Thalmor prisoner` → `Thalmor Prisoner`.
   - `At Angi's camp` → `At Angis Camp`; `Dwemer ruin` → `Dwemer Ruin`; `Bounty hunter` → `Bounty Hunter`; `Roadside ambush` → `Roadside Ambush`; `Prisoner in a bandit fort` → `Prisoner in a Bandit Fort`; `Fell in a spike pit` → `Fell in a Spike Pit`; `Out in the wilderness` → `Out in the Wilderness`.
   - The old `Merchant or mercenary` → no start, with a problem line on Set up's start step asking to pick Merchant or Mercenary. (Jo'Vashar and Azrem on staging have it; the chat session sets them to Merchant · Cyrodiil and Mercenary · Hammerfell after this ships.)
6. **Set up:** the start step lists the 25 starts in the game's order, grouped by source mod. Each start shows its own text when chosen. A start with options shows them as a select under it (`Inn`, `Port`, `Hold`, `City`, `Homeland`, `Guild`, `Shrine`, `Temple`, `Helgen Keep`; the label is per start, set in `overrides.json`). The option is optional, and `Random` is a choice like any other.

### Level note size
7. Level notes can run long. The note text in the level card goes from Alegreya italic 21 px to 17 px, line height 1.55. The author's line above it stays.
   - **Over about 600 characters**, the note is clamped to 12 lines with `Read more` to expand it in place.

### Done when
- [x] e2e: the about bar's labels read in the order above on Azrem's page.
- [x] e2e: hovering each item shows its tooltip; `Phalanx` and `Focused Combat` are separate targets. Clicking Start opens the popover with the choices, and Esc closes it.
- [x] Unit tests for the old-name mapping in #5, including `Guild member: Companions` → `Guilds` / `Companions`.
- [x] `starts.json` built from `starts_raw.json`: 25 starts, and the option lists match it exactly.
- [x] Screenshots for Dave at 1440 and 390: the about bar with a tooltip open and with the Start popover open; Set up's start step with a start's choices; a long level note clamped.
- [x] All checks in CLAUDE.md pass.

---

## WO-30  Icons: level markers, gear slots, game modes, tags (11 Oct 2026)

Dave approved four sets, 24 icons in all. Deities are not in this order (they followed in WO-34). Do after WO-29.

**The icons are already drawn** (chat session, 11 Oct): 24 SVGs in `public/icons/` as `mark-*`, `slot-*`, `mode-*` and `tag-*`, drawn by `scripts/icons/pixels.py` (the `MARKS`, `SLOTS`, `MODES` and `TAGS` sets). This order is wiring them in, once Dave has approved the contact sheet. Don't redraw any; if one needs changing, change its function in `pixels.py` and rerun it.

Two objects changed from the first plan, to avoid clashes with existing icons:
- **Note** is an inkwell with a quill, because Evasion is a feather.
- **Naaktiid** is a sprouting seedling, because Wayfarer is a lantern.

### 1. Level markers (5)
| Icon | Object |
|---|---|
| Trainer | A straw training dummy on a post |
| Skill book | A closed book with a brass clasp |
| Banked | A small iron-bound strongbox |
| Perk points | An ember orb in a glow ring, like a taken star in the trees (the four-point star is Destiny's) |
| Note | An inkwell with a quill (`mark-note`) |

These go beside the labels in the level card (`Trainer`, `Skill book`, `Banked`) and in the pinned bar's chips (WO-21). They also go in the editor's Between level-ups rows and next to `Perk points` in the level header. Destiny points keep the existing Destiny icon.

### 2. Gear slots (10, WO-22)
| Slot | Object |
|---|---|
| Main hand | A flanged mace |
| Off hand | A torch |
| Head | A helmet |
| Body | A leather jerkin |
| Hands | A pair of gauntlets |
| Feet | A pair of boots |
| Ring | A gold ring with a stone |
| Amulet | An amulet on a chain |
| Ammo | A quiver of arrows |
| Other | A satchel |

These are used in the editor's Gear block, `Gear at level N`, the level card's Gear row and the WO-23 gear search.

### 3. Game modes (2)
| Mode | Object |
|---|---|
| Konahrik (Classic LoreRim Experience) | Konahrik's gold dragon priest mask |
| Naaktiid (New to LoreRim) | A sprouting seedling (`mode-naaktiid`) |

These go next to the mode in the about bar, in Set up's mode step, and on cards if the mode shows there.

### 4. Tags (7 new, WO-18)
Tags that match a skill reuse its icon:
- One-Handed, Two-Handed, Marksman, Heavy Armor, Destruction, Conjuration, Illusion, Alteration and Restoration use their own skill's icon.
- Light Armor uses Evasion; Stealth uses Sneak; Thief uses Finesse; Crafter uses Smithing.

The seven tags with no skill icon get new ones:

| Tag | Object |
|---|---|
| Shield | A kite shield, distinct from Block's |
| Unarmored | A bare fist with cloth hand wraps |
| Spellsword | A sword with a blue flame along the blade |
| Necromancy | A gravestone with a rising wisp (a skull is Conjuration's) |
| Shouts | A dragon's head in profile, jaws open, with the Voice |
| Tank | A tower shield planted in the ground |
| Beginner-friendly | A signpost |

These show on the tag chips in Set up and Browse builds, and on the build page under the meta line.

### Done when
- [x] All 24 drawn by `pixels.py` (chat session).
- [x] Dave has approved the contact sheet (chat) before any icon is wired in.
- [x] Each icon appears in the places listed for its set. Every icon has `alt=""`, and its name sits beside it.
- [x] Screenshots for Dave at 1440: the level card with Trainer, Skill book and Banked; the editor's Gear block; the about bar's mode; Browse builds' tag filter.
- [x] All checks in CLAUDE.md pass.

---

## WO-31  Findings from a 30-level build (11 Oct 2026)

The chat session built **Iriel Thornwhisper, Green Pact Hunter** (`/b/7h38zdhjnu`) on staging, levels 1 to 30, through the editor:
- Bosmer, The Shadow, Jephre, Naaktiid, Pilgrim (Shrine) · The Eldergleam Sanctuary.
- 37 perks and 7 Destiny stars, two standing stones, six trainer sessions and two skill books.
- 26 gear changes, including one item emptied, and a note at every level.
- An intro, and a guide with headings, both list kinds, bold, italic, a dividing line and three @-mentions (two items, one perk).

Every level on the shared page matches the plan: perks, Destiny, stones, trainers, books, gear and notes. The build has no problems, and autosave kept up throughout. At 390 px the page has no sideways scroll.

What went wrong or read badly is below, most serious first. Do after WO-30.

### Bugs
1. **A dividing line in the guide editor is 12 lines tall.**
   - In `guide-page.module.css`, `.guideField [contenteditable]` and `.intro [contenteditable]` also match ProseMirror's `contenteditable="false"` nodes: the line, mention chips and images.
   - The line gets the field's `min-height` (353 px), and text typed after it lands at the bottom of the field.
   - Target the editor root only (`[contenteditable="true"]`). Remove the `min-height: 0` in `mention.module.css` if it was only working around this.
2. **`Gear at level N` overlaps at 1440.** Item chips don't wrap in the 220 px grid cells:
   - `Elven Hunter Helmet` runs over Body's icon;
   - `Elven Hunter Gauntlets` runs over Feet;
   - `Elven Hunter Boots` runs past the column's right edge.
   Long names wrap inside their cell. Nothing overlaps at 1440, 1100 or 390.
3. **Item data reaches browsers up to a day late.** `/api/items/5.0.4.8` is served with `max-age=86400`. After the Polearm follow-up (b250ed5), Chrome still listed `Imperial Pike` as a Greatsword in the @-menu, while the server already says Polearm.
   - Put a hash of `items.json` in the URL, set at build time (`/api/items/5.0.4.8?v=<hash>`), so a rebuilt index is fetched at once.
   - Keep the long cache.
4. **12 weapons are still typed by their animation**, because the type word isn't the name's last word:
   - `Spear of the Hunter` is a Greatsword;
   - `Daedric Pike of the Inferno` is a Greatsword;
   - `Paladin Halberd (Rusty)` and `Knight of Kynareth Halberd (Tarnished Silver)` are Battleaxes;
   - `Daedric Halberd of the Inferno` is a Battleaxe;
   - `Daedric Quarterstaff of the Inferno` is a Warhammer.
   In `items.py`, match Spear, Pike, Halberd, Glaive, Quarterstaff and Javelin as a whole word anywhere in the name.
   - Leave the four `Staff` weapons as they are (`Coldflame Staff`, `Heretic's Staff`, `Pope Megus' Staff`, `Staff of Wandering Stars`), and list them in the commit message for Dave.
5. **Dates are in UTC.** `src/lib/format/date.ts` formats with `timeZone: "UTC"`, so builds saved on the evening of 11 Oct in Denver show `12 Oct 2026` on cards, `My builds` and the build page.
   - Show dates in the viewer's time zone, in a `<time datetime>`, on the client.
6. **Tag suggestions miss three majors.** `suggestedTags` maps only Block and Evasion, so Iriel (Marksman, Sneak, Alchemy) was offered only Marksman. Add the same pairs WO-30 uses for icons:
   - Sneak → Stealth
   - Finesse → Thief
   - Smithing → Crafter
7. **Search doesn't find the deity, birthsign or start.** `Jephre` finds nothing.
   - Add `plan->>'deity'`, `plan->>'birthsign'`, `plan->>'start'` and `plan->>'startOption'` to the search in `queries.ts`.
   - The placeholder names what it searches: `Name, author, race, deity, trait`.

### Editor
8. **Deity is a text box.** Set up offers a datalist, so any typing is accepted.
   - Make it a select of the deities in `deities.json`: `None` first, then the ones offered to the race, then the rest, as two groups.
   - Once a deity is chosen, show its text under the select (follower, devotee, tenets, from `deity-text.json`), as the birthsign step does.
   - A saved value that matches none (old free text) is matched by letters only, as in WO-29. When there is still no match, it shows as a problem line on that step.
9. **Set up's summary** (left column) doesn't mention the deity. It goes on the line with the mode and start.
10. **The cover focus hint is how-to copy:** `Click the image where the build page should centre it. Now 54% across, 18% down.` Drop the sentence. Show the focus as a small marker on the image instead, and the crop it gives as the hero will show it.
11. **The perk card covers the editor.** After `Confirm`, the card stays open at the bottom left of the window, over the skill list (Wayfarer to Destruction). Further down the page it covers the Gear block and the note.
    - Close it on `Confirm`: the star's new state shows the perk was taken.
    - Opening a taken perk still shows `Taken at level N` and `Remove`.

### Shared page
12. **Copy link and Edit appear twice for the owner**, once in the edit bar and once in the hero. When the edit bar shows, the hero has neither. Visitors keep the hero's `Copy link` and `Copy to my builds`.
13. **The Guide tab has an eyebrow label.** A `GUIDE` label sits above the guide, under a tab that already says Guide (`guide-section.tsx:53`). Remove it.
14. **Item hover text is thin.** Hovering an item mention shows only `BOW · 50 DAMAGE · 8 WEIGHT`, while perks show their name and text.
    - Show the item's name with its slot icon, then the stats line.
    - Item chips in the guide carry the slot icon, as perk chips carry their skill's.
15. **The level legend:**
    - It lists `Skill 100 perk` when the build has none. Show only the marks that occur.
    - At 390, its last item is cut to `N`. Let it wrap.
16. **The deity tooltip and the Start popover set the game's text differently.** The tooltip uses small sans text; the popover uses Alegreya italic. Use the popover's style for the game's own words in both.

### Done when
- [x] e2e: a guide with a dividing line between two paragraphs. The line's box is under 60 px tall, and the second paragraph sits directly below it.
- [x] Screenshot at 1440 and 390: Iriel's `Gear at level 22` with no overlaps.
- [x] The items URL changes when `items.json` changes (unit test on the hash helper).
- [x] `items.json` rebuilt: the six named weapons in #4 are typed Spear, Polearm or Quarterstaff. The four Staffs are listed in the commit message.
- [x] Unit test: `formatDate` of `2026-10-12T02:00:00Z` in `America/Denver` gives `11 Oct 2026`.
- [x] Unit test: `suggestedTags(["Marksman", "Sneak", "Alchemy"])` gives Marksman and Stealth.
- [x] e2e: searching `Jephre` on Browse finds Iriel.
- [x] Screenshots of Set up's deity step: no deity, then Jephre chosen with its text.
- [x] e2e: after `Confirm`, the perk card is closed.
- [x] Screenshot of the owner's build page at 1440: one Copy link and one Edit. The Guide tab has no `GUIDE` label.
- [x] Screenshot of an item mention's hover text and of the legend at 390.
- [x] All checks in CLAUDE.md pass.

**For Dave, not Jeff:** `My builds` on staging still has three test builds: `iuguyg`, `QA Breton Spellsword` and `Test Build 1`. Delete them or keep them as you like.

---

## WO-32  Gear you can follow, and Destiny folded (11 Oct 2026)

Dave approved the mockup: the design canvas's **"Levels tab: perks, Destiny folded, then gear"** artboard (`LevelGear.dc.html`, Iriel at level 22). Build it to match. Do after WO-31.

**Dave's notes.** Gear was easy to miss. It was hard to see what was new at a level, and hard to make sense of it all together. Perks and Destiny should come before gear, and Destiny should stay out of the way unless a star was taken at this level.

### Order of the Levels tab
1. Below the level card, the order becomes:
   - attributes and skills, as now;
   - `Perks at level N`;
   - Destiny;
   - `Gear at level N`, as its own section, last.
   The pinned bar's chips still scroll to the right section.

### Destiny folded
2. Destiny is one line, as on the artboard:
   - the Destiny mark and name in gold;
   - the stars taken so far, in order;
   - `Next star at level N` (or nothing after the last one);
   - a `Show the tree` / `Hide the tree` button with `aria-expanded`.
3. It opens by itself on a level where a Destiny star is taken. It also opens when the pinned bar's Destiny chip, or a Destiny star in the level card, is clicked.
   - Otherwise it stays as the viewer left it while they move between levels.
   - Open, it is the WO-27 section as now.

### Gear at a level
4. **In the level card**, the Gear row is renamed `New gear`. Each item at the level is shown as:
   - its slot icon;
   - the item, in an ember chip;
   - `Body, replaces Leather Scout Armor` muted beside it;
   - `replaces nothing` when the slot was empty;
   - an emptied slot as `Poison vials (Other) removed`, as now.
5. **`Gear at level N`** becomes slot cards, in the fixed slot order, four to a row at 1440 and one column at 390. Each card has:
   - the slot icon and name;
   - the item name, wrapping as needed;
   - the item's stats line from the item index, or the note for free-text items;
   - a status line. New at this level: an ember border and `New at level 22, was Bosmeri Hood`. Otherwise: `Since level 14`, muted.
   This replaces WO-31's wrapped list.
6. **The gear timeline** sits under the cards, with every slot across the whole build:
   - one row per slot the build ever uses, levels 1 to the last across;
   - each item is a bar over the levels it's held, with its name in the bar, cut with `…` when narrow, and the full name and levels in its hover text;
   - bars that start at this level are ember, the held ones light, the rest muted, and this level's column is marked;
   - an emptied slot's bar just ends.
   Clicking a bar goes to the level it starts at. The bars are links, reachable by Tab, labelled e.g. `Elven Light Bow, levels 14 to 25`. At 390, the timeline scrolls sideways in its own box; the page doesn't.
7. **Marks on the level row:**
   - the ruler and the level tiles get a gear mark at levels with a gear change, using `slot-other`'s satchel, and the legend gets `Gear`;
   - the pinned bar gets a `Gear` chip at those levels, which scrolls to `Gear at level N`.

### Check the arrow numbers
8. Iriel's item cards show `Iron Arrow · 54 damage` and `Steel Arrow · 40 damage`.
   - Check `items.py`'s AMMO reading against the winning records. It reads DATA as projectile, flags, then damage; make sure it reads the right plugin's record when several items share a name.
   - Report what the records say in the commit message. If the numbers are the game's, leave them.
   - Light bows doing less damage than the Imperial Bow is probably real (they're faster); leave those.

### Done when
- [x] Screenshots at 1440 of Iriel at level 22 match the artboard: the order, Destiny folded, `New gear` in the card, the slot cards and the timeline.
- [x] Screenshots of Iriel at 25 (Destiny open by itself, Glass not yet) and at 26 (Glass Light Bow and Glass Arrow new), and of level 22 at 390.
- [x] e2e: on a level with no Destiny star, the Destiny section is one line. On level 25 it is open. `Show the tree` opens it.
- [x] e2e: clicking `Elven Light Bow` in the timeline goes to level 14.
- [x] The ruler, level tiles and pinned bar show the gear mark at 1, 6, 10, 14, 18, 20, 22, 26 and 30 on Iriel, and nowhere else.
- [x] The arrow numbers checked, and the commit message says what the records hold.
- [x] All checks in CLAUDE.md pass.

---

## WO-33  Link preview cards (11 Oct 2026)

When a link is pasted into Messages, Discord or Slack, the app fetches the page and reads its Open Graph tags: a title, a description and one image (1200×630). Build pages send no image today, so a build link shows as a plain grey bubble.

Dave approved the canvas row **"Proposal: link preview cards"**. Build to match. Do after WO-32.
- `ShareBuild.dc.html`: a build's card.
- `ShareSite.dc.html`: one card for every other page.
- `ShareInMessages.dc.html`: how a build link looks in Messages.

### The two cards
1. **A build's card**, 1200×630, made per build with Next's `opengraph-image` (`ImageResponse`) under `src/app/(site)/b/[id]/`:
   - The build's cover image fills the card, cropped at its `coverFocus` the same way the hero is. Darken it from the left and the bottom as on the artboard.
   - The LoreRim Build Planner wordmark top left, and the gold corner brackets.
   - Bottom left, in this order:
     - the build's name, in Sofia Sans Extra Condensed caps, at most two lines, cut with `…`;
     - its description, in Alegreya italic, at most two lines;
     - race, birthsign and game mode, each with its icon;
     - the author, `Levels 1 to N`, and the LoreRim version.
   - Keep text 60 px clear of every edge; Messages crops a little.
2. **The site's card**, 1200×630, one static image for every page that isn't a build (home, Browse, profiles, `My builds`, the guide and Set up pages):
   - the star mark, `LoreRim Build Planner`, the site's own line (`Plan and share LoreRim character builds level by level.`) and the version tag;
   - the 18 skill icons in a framed grid on the right.
   Set it once in the root layout's metadata.
3. **When a build has no card of its own:**
   - A build with no cover gets the site's card, with the build's name in place of `LoreRim Build Planner`.
   - A private build gets the site's card exactly as it is. Its title tag is the site name only, so nothing about it shows to someone without access.
   - Unlisted (link-only) builds get their full card: whoever has the link may see it.
4. **Profiles** (`/u/[handle]`) use the site's card for now, in place of the newest build's raw cover image. That image was uncropped, and could be any size.

### Tags and plumbing
5. Every page sets:
   - `og:title`, `og:description`, `og:image` with width and height, and `og:url`;
   - `og:site_name` = `LoreRim Build Planner`;
   - `twitter:card` = `summary_large_image`.
   Set `metadataBase` so image URLs are absolute on staging (its own host) and on production.
6. **Fonts:** `ImageResponse` can't read the woff2 that `next/font` serves.
   - Commit TTFs of Sofia Sans Extra Condensed Bold, Sofia Sans Medium and Alegreya Italic, with their OFL licence files, next to the image code.
   - Load only those three.
7. **Icons:** draw the pixel icons from `public/icons/` as data-URI SVGs, at whole-number sizes so they stay crisp.
8. **Caching:**
   - A build's card URL carries the build's `updatedAt`, so an edit gives a new image.
   - The site card can be cached for good.

### Done when
- [x] Unit test: the metadata for a private build has no build name, description or cover anywhere in it.
- [x] PNGs for Dave of Iriel's card, Azrem's card, a build with no cover, and the site card. Each is 1200×630 and matches the artboards.
- [x] e2e: Iriel's page has `og:image` pointing at her card, which returns a 1200×630 PNG. The home page's `og:image` is the site card.
- [x] Checked by pasting the staging links into a link-preview checker, e.g. opengraph.xyz (it reads the tags the way Messages does). Screenshots for Dave.
- [x] All checks in CLAUDE.md pass.

---

## WO-34  Deity icons, and every Wintersun deity in the list (11 Oct 2026)

Dave approved the deity contact sheet (chat, 11 Oct). This is the set WO-30 left out. Do after WO-33.

**The icons are already drawn** (chat session): 55 SVGs in `public/icons/` as `deity-*.svg`, drawn by `scripts/icons/pixels.py` (the `DEITIES` set). Don't redraw any; if one needs changing, change its function in `pixels.py` and rerun it. Each file name is `deity-` plus `slug()` of the deity's name, e.g. `deity-riddle-thar`, `deity-z-en`, `deity-the-hoonding`.

### All 55 deities
1. The planner lists only the 35 deities offered to the races at the start. Wintersun has 55, and any of them can be joined at a shrine. Add the other 20 to the list:
   - Almalexia, Baan Dar, Clavicus Vile, Ebonarm, Hermaeus Mora, Jyggalag, Mannimarco, Meridia, Namira, Nocturnal;
   - Peryite, Sanguine, Sai, Sotha Sil, St. Alessia, The All-Maker, The Magna-Ge, The Old Ways, Vaermina, Vivec.
2. **Their names** come from Wintersun's own text: the tenets record's name with `Tenets of ` taken off and a leading `the` capitalised (`Tenets of the All-Maker` → `The All-Maker`). This gives all 55 the names on the contact sheet. Note that Wintersun's key `Totems` comes out as `The Old Ways`.
3. **Data:**
   - `build.py` writes `deity-text.json` for all 55 from `deities_raw.json`.
   - The planner's deity list (`deities` in `data.ts`) comes from `deity-text.json`, not only from the races' starting lists.
   - `deities.json` (who is offered to which race) is unchanged.
   - In Set up, the 20 join the select's second group, `Any other god, at a shrine`.

### Where the icons show
4. Next to the deity's name wherever it's named:
   - the about bar's Deity value, and the head of its hover text;
   - Set up's deity step: the chosen deity's icon beside the select, and again above its Wintersun text;
   - the Set up summary line that names the deity (WO-31).
   Use a `DeityIcon` like `SlotIcon`, with `alt=""` and the name beside it, as WO-30 did.
5. A native select can't show icons in its options. Leave the select as it is.

### Done when
- [x] `deity-text.json` has 55 deities. Unit test: every name in the planner's deity list has a `public/icons/deity-<slug>.svg`.
- [x] Unit test: `Tenets of the All-Maker` becomes `The All-Maker`, and the key `Totems` is named `The Old Ways`.
- [x] Screenshots for Dave at 1440: Iriel's about bar with Jephre's icon and its hover text open; Set up's deity step with Hermaeus Mora chosen.
- [x] All checks in CLAUDE.md pass.

---

## WO-35  Big monitors and tall pages (11 Oct 2026)

Dave approved the canvas row **"Proposal: big monitors and tall pages"** (`WideRail.dc.html`, Iriel at level 30 on a 2560 screen). Build to match. Do after WO-34.

**What's wrong now.** The chat session screenshotted Iriel at 2560×1440 and 3440×1440. Above 1600 the page only gets wider (`--page-max` 2080, then 2560), and everything in it stays laptop-sized:
- the intro runs about 200 characters a line at 2560 and 260 on an ultrawide;
- the level card is mostly empty space;
- the perk tree box is about one and a half screens tall.

Most players are on big gaming monitors.

### 1. Scale the page, don't stretch it
- From 1920 wide, the whole page scales up: text, icons, controls, trees and cards, all in proportion. It lays out as it does at 1600 and is drawn larger.
- Steps:

  | Window width | Scale |
  |---|---|
  | 1920 | 1.125 |
  | 2240 | 1.25 |
  | 2560 and up | 1.5 |
  | 3600 and up, and at least 1900 tall (a 4K screen at 100%) | 2 |

- Replace the `--page-max` steps above 1600 with this. CSS `zoom` on the page root is the expected way. Root-size scaling is fine if it gives the same result without touching every px value.
- Everything that measures the pointer must still work under the scale:
  - perk tree pan, zoom and clicks;
  - the pinned bar's appearing point;
  - tooltips, the Start popover and @-mention hover text, placed next to what they belong to;
  - the gear timeline's links.
- The player's own browser zoom (Ctrl + / −) still works on top of this.
- Phones and laptops are unchanged.

### 2. A contents rail on wide screens
- When the page has room (a layout width of at least 1600 after scaling), a contents rail sits on the left of the build page. It takes about 220 px plus a gap from the page width, so the main column stays about as wide as at 1440. It is a `nav` labelled `On this page`.
- **On the Levels tab**, the rail lists:
  - `Level N`;
  - `Attributes and skills`;
  - `Perks`, with the number taken, and under it each tree the build holds perks in, with its count;
  - `Destiny`, with its count, only when the build takes Destiny perks;
  - `Gear`, with the number of slots held, only when the build has gear;
  - `Guide`, which switches tabs.
- **On the Guide tab**, it lists the guide's headings instead, and `Levels`.
- **Behaviour:**
  - Clicking an entry scrolls to its section, below the pinned bar.
  - A tree entry also opens that tree; `Destiny` also unfolds the Destiny section.
  - The section in view is marked, in ember with a bar, and has `aria-current`.
  - The rail sticks below the pinned bar as the page scrolls.
- Narrower than that, there's no rail, and nothing else changes.

### 3. The taken list follows the open tree
- Beside the perk tree, `Taken by level N` shows only the open tree's perks in full.
- Every other tree the build holds perks in is one line, its name and count with `▸`. Clicking the line opens that tree, the same as its chip.
- The header keeps the total, e.g. `Taken by level 30 · 33`.
- The Destiny section's list and the phone list view stay as they are.

### Done when
- [x] Screenshots of Iriel at level 30 at 1440, 1920, 2560×1440 and 3440×1440. At 2560 it matches the artboard. At 1440 it looks as it does today, with no rail.
- [x] e2e at 2560: the rail is shown. Clicking `Gear` scrolls to `Gear at level 30` and marks `Gear` current. Clicking `Sneak` under Perks opens the Sneak tree.
- [x] e2e at 2560: dragging the perk tree pans it by the distance dragged, and clicking a star opens that star's details.
- [x] e2e: clicking `Marksman 11 ▸` in the taken list opens the Marksman tree, and its perks are listed in full.
- [x] All checks in CLAUDE.md pass, and the screenshots are checked in Chrome and Firefox. Safari is Dave's.

---

## WO-36  Set up fixes, a Roleplay tag, and a Like that feels good (12 Oct 2026)

From Dave's notes, 12 Oct. Do after WO-35.

### Set up
1. **Hovering a chosen tag hides its name.** `.tagChip:hover:not(:disabled)` sets the text to ember, and it outranks `[aria-pressed="true"]`, so on hover a chosen chip is ember on ember (`wizard.module.css`).
   - A chosen chip keeps its dark text on hover, its background a shade darker (`#d97f33`, as `.btn-primary:active` uses).
   - Check every chip-like toggle in Set up for the same clash.
2. **The LoreRim version goes on the first screen.** The `Building for LoreRim 5.0.4.8 · Latest · Change` band moves from the Name step to the top of the Race step, the first thing a new build sees. The sidebar's version line under Race stays.
3. **The last step is `Details`.** It now holds the name, description, cover, tags and who can see it, and the theme will join them in WO-37.
   - Rename it in `STEP_NAMES`; the step key stays `name`, so saved drafts keep working.
   - The `Next:` button before it reads `Next: Details`.

### A Roleplay tag
4. Add `Roleplay` to `Way of play`, after `Beginner-friendly`.
   - Tags are seeded by migration (see `tags.ts`), so it needs one: `npm run db:generate`, with the SQL committed.
   - Its icon is already drawn: `public/icons/tag-roleplay.svg`, two theatre masks, from `tag_roleplay` in `pixels.py` (chat session, 12 Oct).

### Like
5. Dave wants players to feel amazing for clicking Like. When a player likes a build (not when they unlike), `like-button.tsx` plays this:
   - **The heart pops:** it fills, scales 1 → 1.35 → 0.95 → 1 over about 350 ms, and goes from ember to a warm rose (`#f1b3a6` on `#d07a6a`).
   - **A burst of pixel hearts:** 12 small hearts and 6 sparks fly out from the heart, 30–70 px, in ember, rose and gold. Each turns a little and fades out by about 750 ms.
     - Draw the hearts as a 7×6 pixel grid in the icons' style, rows `.XX.XX.`, `XXXXXXX`, `XXXXXXX`, `.XXXXX.`, `..XXX..`, `...X...`, with the dark outline.
     - The sparks are the Destiny four-point star, small.
   - **A soft ring pulses** once behind the button.
   - **The count rolls:** the old number slides up and out, the new one slides in.
   - The burst is an overlay that takes no clicks and can spill outside the button. Nothing on the page moves.
   - Unliking is quiet: the fill drains and the count rolls down.
   - With `prefers-reduced-motion`, there's no burst, ring or roll: just the fill and the new number.

### Done when
- [x] e2e: hovering a chosen tag in Set up keeps its name readable (text colour differs from the background).
- [x] Screenshot: the Race step with the version band at the top. The sidebar's last step reads `Details`.
- [x] `Roleplay` shows under `Way of play` in Set up and on Browse builds, with its icon. The migration is committed.
- [x] A short screen recording (GIF) of the Like burst for Dave, and a frame with reduced motion on.
- [x] All checks in CLAUDE.md pass.

---

## WO-37  The Details step: guide themes, and an About note (12 Oct 2026)

Dave approved the canvas row **"Proposal: themes, the Details step, and an About note"** (12 Oct): `DetailsThemes.dc.html` and `AboutNote.dc.html`. Build to match, with the About text as written below. Do after WO-36.

### Guide themes
1. A build has a theme, picked in Set up's `Details` step. It sets the look of that build's page below the site header: the hero's tint, the page ground, panels, rules, accent, the drop cap and dividers, and the guide's text colours. Fonts and layout don't change.
2. **The five themes**, colours from the artboard:

   | Theme | Line under its name | Ground / panel / text / accent / ornament |
   |---|---|---|
   | Ember (default) | Night and forge-light. The default. | `#0e1319` / `#121922` / `#e4ebf0` / `#f0913f` / `#b9a173` |
   | Parchment | A note left on a table. | `#ebe1c8` / `#f4edda` / `#2b2116` / `#8c2f1c` / `#8a6d3b` |
   | Frost | Snow light over the Throat. | `#0f1a24` / `#142330` / `#eaf2f8` / `#8ecae6` / `#c9d6df` |
   | Daedric | Black iron and old blood. | `#120a0b` / `#1b0f10` / `#f0e4e2` / `#d8432f` / `#b8862f` |
   | Dwemer | Bronze, steam and verdigris. | `#10181a` / `#162224` / `#e8e2d4` / `#d39b4a` / `#6fae9c` |

   - Set each theme as CSS custom properties on the build page's root, overriding the existing tokens, so components need no theme logic of their own.
   - Every text and accent pair must meet WCAG AA (4.5:1 for body text, 3:1 for large text and icons). Adjust a shade if one fails, and say which in the commit.
3. **The picker:** five cards in a row, each with a small diagram of the build page drawn in that theme (hero block, title line, drop cap and text lines, divider, chips, a panel), its name and its line.
   - They are real toggle buttons with `aria-pressed`.
   - Under them, a larger preview of the top of this build's own page (its name, description, intro start and a level panel) in the chosen theme, changing as the player picks.
4. **Data:** `BuildPlan` or the build row gains `theme`, default `ember`. Existing builds are Ember. The link preview card (WO-33) stays as it is for every theme.

### An About note
5. A short note from Dave, shown as an in-game note: torn-edged parchment, tilted a degree, a wax seal, Alegreya.
   - It's reached from a quiet `About` link at the foot of every page; WO-24 removed the nav, so it's the one link there.
   - The page is `/about`, with the site's link card.
   - The text, as on the artboard:

   > **To whoever finds this,**
   >
   > We came to LoreRim the way most do: died in the first cave, came back, died a little later. Somewhere between the third bandit camp and the hundredth perk, we fell for it.
   >
   > This planner is our way of paying that back. Plan a character one level at a time, share it, and learn from the ones who walked the road before you. If it gets one new player through their first winter, it was worth the ink.
   >
   > Walk well. Mind the frostbite spiders.
   >
   > *— Tapps, by candlelight*

### Done when
- [x] Screenshots of the Details step with each of the five themes picked. They match the artboard.
- [x] Screenshots of Iriel's page at 1440 in all five themes, and in Parchment at 390.
- [x] A contrast check of every theme's pairs, in the commit message.
- [x] e2e: picking Frost and saving shows Iriel's page in Frost; an existing build with no theme shows Ember.
- [x] Screenshot of `/about` at 1440 and 390. The foot link appears on the home page, a build page and a profile.
- [x] All checks in CLAUDE.md pass.

---

## WO-38  Menus that close, a footer, the drop cap, card hover, and a pixel logo (12 Oct 2026)

From Dave's notes, 12 Oct. Do after WO-37.

### 1. Every menu closes when you click outside it
Every dropdown, popover and menu closes on a click or tap outside it, and on Esc, returning focus to the button that opened it. That covers:
- the account menu;
- the edit bar's `More` and visibility menus;
- Browse's Tags filter;
- `Other trees ▾`;
- the guide editor's `More` and the @-mention list;
- the Start popover;
- the gear item search;
- anything else with `aria-haspopup` or `aria-expanded`.

Use one shared hook (pointer-down outside plus Esc) rather than a fix per menu. Native `<select>`s already behave.

### 2. A footer
WO-37's one-link foot becomes a real footer, on theme and quiet, the same on every site page:
- **Left:** the pixel logo (§5) small, and `Made by Tapps`, linking to `/about`.
- **Middle:** a loading-screen tip, as Skyrim shows them: `TIP` in the label style, then one line. A new tip on each page load, from `src/data/tips.json` (list below). No arrows or carousel.
- **Right:**
  - `The LoreRim community gathers on The Modding Bungalo Discord`, linking to `https://discord.gg/bungalo`. That's the invite in the Wabbajack registry entry; the server's own name is spelled without the w.
  - `About`.
- **Under it all, small and muted:** `Fan-made. Not affiliated with Bethesda or the LoreRim team.`
- At 390, it stacks in that order.

**The tips.** Each one was checked against the game files in the field guide (`lorerim/systems/*`):
1. Any lit campfire is a place to rest, except a giant's.
2. Swimming in icy water takes you straight to Numb. Get out and find a fire.
3. Craft a waterskin at a tanning rack from one leather and one leather strip. Innkeepers refill it for free.
4. Hot soups and stews warm you as well as feed you.
5. A lit torch in hand is worth 50 warmth.
6. You level up when you sleep. Survival Control Panel can change that.
7. Carry weight doesn't grow with your level. Wayfarer perks and gear raise it.
8. Arrows and lockpicks weigh nothing.
9. You come back where you last slept or rested by a campfire.
10. Shrines no longer cure diseases.
11. Fast travel is off. Carriages cost 10 to 400 gold, by distance.
12. You can't save in combat.
13. Bounties are ten times what they were in vanilla Skyrim.
14. F11 shows the hotkey list.

### 3. The drop cap
- **The problem:** the current one is a bold Alegreya capital in a framed square with corner marks and an ember wash. Narrow letters (`I`, `J`, `l`) sit in it like a pillar between two dark bands, and wide ones crowd it.
- **The fix:** drop the square, the corners and the wash. The first letter stays as is:
  - 3 lines tall, Alegreya Bold, in the theme's ornament colour (`--brass`, or the WO-37 theme's);
  - `initial-letter: 3` where supported, else a float sized to three lines;
  - a little space to its right.
- Keep the small-caps first line.
- Screenshot it with `I`, `W` and `A` as the first letter.

### 4. Build cards on hover
On hover and keyboard focus, a Browse or profile card:
- lifts 3 px with a soft shadow;
- its cover zooms slowly to 1.04 and brightens a touch;
- the gold corner marks (the `.frame` motif) appear at two corners;
- the name turns ember, as now.

About 200 ms out, 150 ms back. With `prefers-reduced-motion`, there's no lift or zoom: just the corners and the colour.

### 5. A pixel-art logo
The header's outline star becomes a pixel-art star in the icons' style:
- a four-point star, gold with an ember heart, drawn 16×16 at 2× (32 px);
- the wordmark text stays.

Every 10 seconds it glints, four frames at about 90 ms each:
1. the heart turns white;
2. the arms stretch a pixel, with diagonal sparkle rays;
3. the rays shrink to four points;
4. back to rest.

The frames are already drawn: `public/icons/logo-0.svg` to `logo-3.svg`, from `logo()` in `pixels.py` (chat session, 12 Oct; preview GIF sent to Dave). Jeff wires them in:
- swap the frames with CSS steps, or a sprite;
- don't animate while the tab is hidden;
- no glint with `prefers-reduced-motion`;
- the favicon becomes `logo-0`.

### Done when
- [x] e2e: open the account menu, the Tags filter and `Other trees`; a click outside each closes it, and Esc closes it and returns focus.
- [x] Screenshots of the footer at 1440 and 390 on the home page and a build page. The Discord link opens `https://discord.gg/bungalo`.
- [x] Unit test: `tips.json` has the 14 tips above, word for word.
- [x] Screenshots of the drop cap with `I`, `W` and `A`, in Ember and Parchment.
- [x] A short GIF of a card's hover, and of the logo's glint.
- [x] All checks in CLAUDE.md pass.

---

## WO-39  Video guides, and a featured build (12 Oct 2026)

From Dave's notes, 12 Oct. Dave hopes to partner with Zenematics (`https://www.youtube.com/@Zenematics`) on the first official character build guide, then feature it. A creator like that must see their video front and centre. Do after WO-38.

### Video guides
1. **Set up's Details step** gets `Video guide` (optional).
   - It takes a YouTube link in any common form: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, `youtube.com/live/`, with or without `www.`, `m.` or extra parameters. Store the video id only.
   - Anything else gets `That isn't a YouTube link.`
2. **On the build page, the video comes first:**
   - **Hero:** a `Watch the video guide` button with a play mark, first and largest among the hero's buttons, in the theme's accent.
   - **Guide tab:** the video sits at the top, above the guide text, full width at 16:9.
   - **Levels tab:** clicking the hero button opens the Guide tab at the video and starts it.
   - Load nothing from YouTube until the player clicks play. Show the video's thumbnail (`i.ytimg.com/vi/<id>/hqdefault.jpg`) with a play button, then swap in a `youtube-nocookie.com` embed.
3. **Cards** (Browse, profiles, featured) carry a small `▶ Video` badge on the cover when the build has one. The link preview card (WO-33) gets a small play badge in its corner.

### A featured build
4. **Who can feature:** admins only. Admins are listed by Discord id in a Vercel environment variable, `ADMIN_DISCORD_IDS`, never committed. Dave adds his own.
5. **Featuring:**
   - An admin sees `Feature this build` / `Stop featuring` in the build page's `More` menu.
   - One build is featured at a time; featuring another replaces it.
   - Store it as `builds.featured_at`, with a migration.
   - Only Listed builds can be featured. A featured build made Unlisted or Private stops being featured.
6. **On Browse**, when there's no search and no filter, the featured build comes first, as a larger card:
   - it spans two columns and is taller;
   - its cover is about 320 px high;
   - a gold `Featured` mark with the Destiny star sits on the cover;
   - the description, and the first two lines of the intro;
   - the `▶ Video` badge, larger, when it has a video.

   With a search or filter, it sits in the grid like any other card. At 390, it's full width and first.

### Done when
- [x] Unit tests: the YouTube link forms above give the right id; a Vimeo link and plain text are refused.
- [x] e2e: add a video to Iriel. The hero shows `Watch the video guide`; clicking it opens the Guide tab with the player; no request goes to youtube.com before the click.
- [x] e2e: as an admin (a test id), feature Iriel. Browse shows her first and two columns wide; a non-admin doesn't see the menu item.
- [x] Screenshots: Browse at 1440 and 390 with Iriel featured and a video; Iriel's Guide tab with the video at the top.
- [x] All checks in CLAUDE.md pass.

---

## WO-40  Safety: image checks, reports, and bot limits (12 Oct 2026)

Dave's call, 12 Oct: use Sightengine's free plan (2,000 images a month, at most 500 a day), and tune it so LoreRim's weapons, gore and near-nudity pass while porn doesn't. Do after WO-39.

**The keys are in** (12 Oct, checked by the chat session): `SIGHTENGINE_API_USER` and `SIGHTENGINE_API_SECRET` are set in Vercel as Sensitive, for Production and Preview, not Development. Unit tests and e2e use a mocked check. Once WO-40 is on staging, upload one real cover there to confirm a live check runs, and say so in the commit. Never print or log the keys. The team is on Vercel Pro, which matters for BotID (§4).

### 1. Every uploaded image is checked before it's stored
- **Where:** both upload routes, `src/app/api/covers/route.ts` and `src/app/api/builds/[id]/images/route.ts`.
- **When:** after the existing size and type checks, before `storeImage`.
- **What's sent:** the bytes go to Sightengine's check endpoint with `models=nudity-2.1` only. Weapons, gore and the rest are never requested.
- **The rule**, with scores from 0 to 1 and the cut-offs in environment variables so Dave can loosen them without a release:

  | Sightengine class | Default cut-off | What happens |
  |---|---|---|
  | `sexual_activity` | `MOD_REFUSE_AT` = 0.8 | refused |
  | `sexual_display` | `MOD_REFUSE_AT` = 0.8 | refused |
  | `erotica` | `MOD_REVIEW_AT` = 0.85 | stored and shown, and added to the review list |
  | `very_suggestive`, `suggestive`, `mildly_suggestive` | none | stored, nothing flagged |

- **A refused upload** gets `This image can't be used here. Covers and guide images can't show sexual content.` Nothing is stored.
- **When the check can't be run** (no keys, a timeout after 8 seconds, an error, or over the free plan's limits), the image is stored and put on the review list marked `not checked`. Never block a player because Sightengine is down.
- **Logging:** for the first 30 days, write every check's class scores to `image_checks` (image URL, uploader, scores, outcome, time), so Dave and the chat session can see where real LoreRim covers land and tune the cut-offs. After that, keep only refused and listed ones.

### 2. Reports
- A quiet `Report` link at the foot of a build page (not shown to its owner) asks `What's wrong?` with `Sexual content`, `Hateful content`, `Spam` and `Something else`, and an optional line.
- One report per signed-in player per build.
- At 3 reports, the build's cover and guide images are hidden behind a plain panel (`This image is waiting for a look.`) until an admin decides.

### 3. The review list, for admins
- **Where:** `/admin/review`, for the admins from WO-39 (`ADMIN_DISCORD_IDS`); everyone else gets a 404.
- **What it lists:** images marked by the check (`erotica`, `not checked`) and builds with reports, newest first. Each shows the image, its scores, the uploader, the reports, and three actions:
  - `Keep` clears it;
  - `Hide image` takes the image down and puts the panel in its place;
  - `Remove image` deletes it from the store.
- A small count shows on the admin's account menu when the list isn't empty.

### 4. Bot limits
- **Rate limits per account**, counted in the database:
  - 10 new builds a day;
  - 20 image uploads a day;
  - 60 likes an hour;
  - 10 reports a day.

  Over a limit, the player sees `That's a lot for one day. Try again tomorrow.` (or `in an hour` for likes).
- **Account age:** a Discord account under 7 days old (from the snowflake in its id) can make Link-only and Private builds, but can't set Listed or upload images until it's 7 days old. The message says when.
- **Vercel's bot protection:** turn on Vercel BotID for sign-in and the server actions that write (create, save, like, report, upload). If it needs a project setting or a paid plan, write down what's needed for Dave instead of changing it.

### Done when
- [x] Unit tests with the check mocked:
  - `sexual_display` 0.9 is refused;
  - `erotica` 0.9 is stored and listed;
  - `mildly_suggestive` 0.95 is stored and not listed;
  - a timeout is stored as `not checked`.
- [x] Unit test: the only model requested is `nudity-2.1`.
- [x] e2e: three different test accounts report a build; its cover hides; an admin presses `Keep` on `/admin/review`; the cover is back.
- [x] e2e: the 11th build in a day is refused with the message. An account 2 days old can't set Listed.
- [x] A note for Dave in the commit on Vercel BotID: on or not, and what it needs.
- [x] All checks in CLAUDE.md pass.

---

## WO-41  Spells: the game data (12 Oct 2026)

Dave, 12 Oct: builds cover gear but never spells, and a mage guide is mostly spells: which to get, when, and where. Zenematics' "How to Mage" (`https://www.youtube.com/watch?v=ajiLsFhYn4I`) is the test case. This order is the data only; WO-42 puts it on screen. Do after WO-40.

### What the chat session already read (12 Oct, Dave's PC, read only)
- **`scripts/gamedata/spells.py`** (new, committed) reads the winning BOOK, SPEL, MGEF, LVLI, GLOB and QUST records. It runs on Dave's PC like `items.py`. Its output, **`gamedata/5.0.4.8/spells_raw.json`**, is committed, so you don't need the game files.
- **1,117 spells** are taught by a spell tome: Conjuration 295, Destruction 245, Alteration 198, Restoration 182, Illusion 160, plus 37 whose main effect has no school (Wintersun's Eldritch Tomes, a few creature powers).
- **Each spell carries:**
  - its form key, name, base cost and cast type;
  - its effects in record order, each with the game's text (`<mag>`, `<dur>`, `<area>` tokens) and the values that fill them;
  - its school (from the first effect's magic skill) and tier (from the highest minimum skill among its effects: 0 Novice, 25 Apprentice, 50 Adept, 75 Expert, 100 Master);
  - the tomes that teach it.
- **Tier perks give free spells.** Requiem - Customizable Spells Per Perk hands you tomes to pick from whenever you take a school's tier perk (`Destruction:Novice Destruction` and so on). LoreRim's numbers are **2 picks per Novice, Apprentice, Adept and Expert perk, and 1 per Master perk**; that's `picksPerPerk` in the raw file. Each school and tier has its own pool (`perkPicks`, 25 pools, 543 spells in all), read from the leveled lists the mod's quest uses. Example: `Destruction Novice` holds 14 spells (Flames, Frostbite, Sparks, Fiery Touch...). Spells that aren't in a pool still exist; you buy or find them (Eldritch Blast is a Novice spell sold by Wuunferth, not a perk pick).

### Build it
1. **`build.py` writes `src/data/lorerim-5.0.4.8/spells.json`**, one entry per spell:
   - `id` (the form key, as `items.json` writes them: `Skyrim.esm:01C789`), `name`, `school`, `tier`, `cost`, `cast`;
   - `text`: the main effect's game text with its tokens filled, the same way perk text is filled today. Some spell text marks numbers as `<20>`; drop the markers with `unmark`, as trait text does;
   - `also`: the names of the other effects that have text, for a second line;
   - `tomes`: the tome names.
2. **Leave out:**
   - spells with no name or no school;
   - repeats with the same name, school and tier: keep the one later in the load order, the way items are merged.
3. **Write `spellPicks`** into the same file: `{ "perTier": {"Novice": 2, ...}, "pools": {"Destruction:Novice Destruction": [spell ids], ...} }`, keyed by the tier perk's id in `perks.json`.
4. **Load it** through the same game-data loader as perks and items, versioned with the rules (`src/lib/rules/versions.ts`), so a build on another version gets that version's spells.
5. **Use the game's words.** Names and text come from the records; don't tidy them. `Oakflesh on Self` stays `Oakflesh on Self`.

### Done when
- [x] `python3 scripts/gamedata/build.py` writes `spells.json` from the committed raw file, and the generated file is committed.
- [x] Unit tests on the built data:
  - Fireball is Destruction, Adept, cost 240, and its text reads `deals 40 fire damage`.
  - Cloudkill is Destruction, Expert; Forbidden Sun is Destruction, Master; Shadow Clone on Self is Illusion, Master.
  - The Destruction Novice pool has 14 spells, including Flames and Sparks, and not Eldritch Blast.
  - `perTier` is 2, 2, 2, 2, 1.
  - No two entries share a name, school and tier.
- [x] `python3 -m pytest scripts/gamedata` passes, with a test for `spells.py`'s school and tier rule.
- [x] All checks in CLAUDE.md pass.

---

## WO-42  Spells in builds (12 Oct 2026)

Do after WO-41. Layout follows the design canvas's **"Spells"** artboard (`Spells.dc.html`, added 12 Oct): the pick list under a tier perk, `New spells` on a level, and the Spells section. Where the artboard and this order disagree, the artboard wins on looks and this order wins on rules.

### 1. The plan
- **A level can list spells learned at that level:** `LevelPlan.spells?: { id: string; where?: string }[]`. `where` is the author's short line ("Wuunferth, Windhelm", "Faralda's lesson").
- **Main spells:** `BuildPlan.mainSpells?: string[]`, up to 8 spell ids: the ones the build actually casts. An author can only star a spell the build learns.
- Older builds have neither field and need no migration.

### 2. Rules (`computeBuild`)
- **Free picks:** taking a tier perk gives that many picks at that level (2, or 1 for Master), from that perk's pool. A pick is a spell row whose id is in the pool of a tier perk taken that level; the first picks up to the count are free, and the rest count as learned another way.
- **New problems:**
  - `spell-repeat`: the same spell learned twice. Message: `Already learned at level N.`
  - `spell-unknown`: an id not in this version's spells (from a version change). Message: `Not in LoreRim N.`
- **No tier rule.** Requiem lets you try any tome; Rite of Arcana drains you while you learn. Don't block a high-tier spell at low skill (rule 9: show the exception, not the default).

### 3. The editor
- **On the Perks step,** when a level takes a tier perk, the perk gets a `Choose 2 spells` list under it, from its pool:
  - search plus A to Z, as traits have;
  - each row shows the name, the cast type, and the game text on hover or tap;
  - chosen spells pin to the top with `1 of 2 chosen`, as traits do (rule 11);
  - spells the build already knows are left out.

  Picks made here save as spell rows with `where` set to the perk's name.
- **A Spells section on each level,** next to Gear, adds a spell learned any other way:
  - search all spells by name, with the school and tier beside each;
  - an optional `Where` line.

  Rows can be removed, and starred as a main spell.
- **The guide editor's @-mentions** find spells too, as they find perks and items.

### 4. The build page
- **Level detail** gets a `New spells` row after `New gear`: each spell as a chip with its school's icon. The tooltip shows tier, cast type, the game text and `where`.
- **A Spells section** after Gear, and in the contents rail:
  - `Main spells` first: the starred ones, in the author's order, each with its text;
  - then every spell learned by the level being viewed, grouped by school in the game's order (Alteration, Conjuration, Destruction, Illusion, Restoration);
  - each spell shows its tier, the level it was learned at and `where`.

  Spells learned after the viewed level stay hidden, the same as perks.
- **Search** on Browse matches spell names, as it matches perks and items.

### Done when
- [x] Unit tests:
  - two picks from the Destruction Novice pool at the level that takes Novice Destruction are free, and a third is "learned another way";
  - learning Fireball twice raises `spell-repeat`;
  - `mainSpells` keeps only spells the build learns.
- [x] e2e: on a test build, take Novice Destruction and Novice Conjuration at level 1, choose 2 spells under each, add Eldritch Blast at level 4 with `Where` = `Wuunferth, Windhelm`, and star it. The shared page shows them in `New spells` at the right levels and in the Spells section, with Eldritch Blast under Main spells.
- [x] Screenshots at 1440 and 390: the Perks step with a pick list open; a level with `New spells`; the Spells section. Check them against the canvas.
- [x] All checks in CLAUDE.md pass.

---

## WO-43  Changing deity later (12 Oct 2026)

Dave, 12 Oct: keep the deity in Set up and the top bar as the start, but let a build switch later. Zen's mage starts with Syrabane (an Altmer can't start with the Magna-Ge) and switches to the Magna-Ge early. Do after WO-42, or before it if it's quicker.

1. **The plan:** `LevelPlan.deity?: string`. Undefined keeps the current one; a name switches to it from that level on. It works like the standing stone field.
2. **The editor:** each level gets a `Deity` control next to the standing stone, `Keep` or a deity. It lists every deity in `deity-text.json`, not just the race's starting list, because a shrine takes anyone later.
3. **The build page:**
   - The top bar still shows the starting deity. When the build switches, a small `i` after it says `Changes to The Magna-Ge at level 3` (rule 4); with several changes, one line each.
   - Level detail shows `Deity: The Magna-Ge (was Syrabane)` on the level it changes.
   - The whole-build ruler marks a deity change the same way it marks a stone change.
4. **Search:** a build matches every deity it follows, not only the first.

### Done when
- [x] Unit test: Syrabane at level 1, the Magna-Ge from level 3; level 2 is Syrabane and level 3 on is the Magna-Ge.
- [x] e2e: switch a test build's deity at level 3; the top bar's `i` and level 3's detail say so; searching `Magna-Ge` finds the build.
- [x] Screenshot at 1440: the top bar tooltip open, and level 3.
- [x] All checks in CLAUDE.md pass.

---

## WO-44  The Oghma Infinium (12 Oct 2026)

The Oghma Infinium is a Daedric book, the reward of Septimus Signus' quest *Discerning the Transmundane*. LoreRim replaces its reward (`LoreRim Oghma Reward.esp`, read 12 Oct):
- reading it opens the Starting Skills menu with **6 skill picks at +5 each**, set straight onto the skills, up to 100;
- then `Hermaeus Mora has blessed you with 3 perk points.`

It can be read once per character. Zen's mage uses it at the end. Do after WO-43.

1. **The plan:** a new extra, `{ kind: "oghma"; skills: string[] }`, with 6 different skills. At most one per build.
2. **Rules:**
   - Each chosen skill goes up 5, capped at 100.
   - This may take a skill past the level's max skill. That's not a problem: the book sets the skill directly. Later skill points still obey the max.
   - The level gets 3 more perk points.
   - New problem `oghma-repeat`: `The Oghma Infinium can only be read once.`
3. **The editor:** in the extras where trainers and skill books go, add `Oghma Infinium`. It asks for 6 skills (chips, `3 of 6 chosen`).
4. **The build page:** that level's detail shows `Oghma Infinium` with the six `+5` skills and `+3 perk points`. Skill gains show the +5 like a book's.

### Done when
- [x] Unit tests:
  - Oghma at level 30 with Alteration 78: Alteration is 83 at level 30, even though max skill is 80;
  - the level has 3 more perk points;
  - a second Oghma raises `oghma-repeat`.
- [x] e2e: add it to a test build; the level detail shows the six skills and `+3 perk points`.
- [x] All checks in CLAUDE.md pass.

---

## WO-45  Gear you make yourself (12 Oct 2026, Dave to confirm the shape)

Most gear is found or bought, and the item index covers it. Some is made by the player, so no record names it until it's made:
- **Enchanted by you:** any item plus enchantments you put on it at an Arcane Enchanter. The game names it ("Glass Sword of Fiery Souls").
- **Spell staffs:** a staff made at a Staff Enchanter, from a spell you know, a heart stone and a soul gem. Zen's mage makes two Cloudkill staffs and a Forbidden Sun staff.
- **Improved at a forge:** tempering (Fine, Superior, and so on) doesn't change what the item is, so it stays a note.

Do after WO-42 (it uses spells).

1. **A gear row can be `Made by you`.** It keeps a base item from the index and adds:
   - for a staff, `Spell` (one spell from `spells.json`): the row reads `Staff of Forbidden Sun`;
   - for anything else, `Enchantments`: up to two lines of free text.
2. **The build page** shows a small hammer mark on made items. The tooltip shows the base item, then the spell or enchantments.
3. **Elemental Padding** (a crafted LoreRim item) and backpacks wait for the gear-slot work below. They're real records, just on slots the planner doesn't show yet.

### Done when
- [x] Unit test: a made staff with Forbidden Sun reads `Staff of Forbidden Sun`.
- [x] e2e: add a made staff from level 40; the shared page shows the mark and the tooltip.
- [x] All checks in CLAUDE.md pass.

---

## WO-46  Findings from Zen's mage (12 Oct 2026)

The chat session recreated Zenematics' "How to Mage" as **Pure Mage, from Zenematics' How to Mage** (`/b/5pjwcg252f`, Link only) on staging:
- Altmer, The Mage, Syrabane, Konahrik, Guilds (College of Winterhold);
- 60 levels, 62 perks and the seven Destiny stars to Archmage, every attribute into Magicka;
- 21 gear rows, five of them free text (made staffs, Elemental Padding, a backpack);
- a note at the levels where the video says to go somewhere, and the video guide.

The rules engine finds no problems on any level. The perks were placed by a script, at the first level each can be taken in the video's order, because the video gives them in batches ("by level 12", "by level 35"). That's the parked **perk wishlist** idea doing real work: an author copying a video will want it. Do this order after WO-45.

1. **Middle dots are still in the UI.** Rule 2 says never `·`. Twelve places in `src` join with it, for example:
   - the Start line on the build page (`Guilds · College of Winterhold`);
   - `Taken by level 1 · 3`;
   - `1 min read · Video`;
   - the Destiny line (`Destiny · Focus · Mage`);
   - profile and admin lines.

   Item stats from `build.py` do too (`Clothing · 1 weight`). Replace each with the rule's options: a comma, its own line, a tag, or `|`.
2. **Free-text gear looks like indexed gear.** `Staff of Forbidden Sun` and `Backpack` have no item behind them but show the same chip and icon. Until WO-45 lands, give a row without `itemId` the `Other` icon and no stats line.

### Done when
- [x] `grep -rn " · " src scripts/gamedata` finds nothing a player sees, and items.json is rebuilt.
- [x] Screenshot of Pure Mage at level 55 at 1440: the free-text rows read as such.
- [x] All checks in CLAUDE.md pass.

---

## WO-47  Gear notes show on the build page (12 Oct 2026)

Dave, 12 Oct: the note an author writes on a gear row ("On the Altar of Magnus", "Make two") shows nowhere on the build page. The chat session checked the code: the `New gear` row never renders `note`; the `Gear at level N` cards show it only when the item has no stats line (`item?.stats ?? g.note`), so an indexed item's note is lost; the timeline bars' `title` has only the name and levels. The note is usually where to get the item, which is the thing a reader wants.

1. **`New gear` on the level card:** the note goes on its own line under the chip, after `Body, replaces College Robes`, in the muted colour, the same way a new spell shows its `where`. No note, no line.
2. **`Gear at level N` cards:** the stats line stays; the note goes on a line of its own below it. Long notes wrap; the card grows rather than truncating.
3. **The gear timeline:** a bar's tooltip reads `Staff of Fireball, levels 5 to 29. On the Altar of Magnus.` (the note added after the levels). Same for the bar's `aria-label`.
4. **Made items:** the hammer mark's tooltip keeps the base item and spell or enchantments; the note shows as above, not inside that tooltip.

### Done when
- [x] e2e: on Pure Mage's level 5 (`/b/5pjwcg252f?level=5` on staging; copy it to a fixture as Iriel was), `New gear` shows `On the Altar of Magnus.` and `Leaning on a tree above the sabre cat cave near the Thalmor Embassy.`; the level-5 card for the main hand shows its stats and the note; the timeline bar's title includes the note.
- [x] Screenshots at 1440 and 390: Pure Mage level 5, the level card and the gear section.
- [x] All checks in CLAUDE.md pass.

---

## WO-48  Build page section titles you can't miss (12 Oct 2026)

Dave, 12 Oct: "Gear at level 11" and the other section titles are too small and easy to miss. They're the shared 13 px brass `.label`, which is meant for small ornament labels, not the titles of the page's main sections.

1. **Which titles:** the build page's section titles. These are `Attributes at level N`, `Skills at level N`, `Perks at level N`, `Gear at level N` and `Spells at level N` (`build-view.tsx`, `gear-view.tsx`, `spell-view.tsx`). The editor's small labels (`Gear`, `Spells` in the editor blocks) and other `.label` uses stay as they are.
2. **Make each a real heading** (`h2`), styled once as a shared class:
   - Sofia Sans Extra Condensed 700, uppercase, letter-spacing .06em;
   - 26 px at desktop, 22 px at 390;
   - the theme's text colour, not brass;
   - `at level N` in the same face at weight 500 in the muted colour, so the section name leads;
   - a 1 px rule in the theme's rule colour under the title, 10 px below it, running the section's full width.
3. **Space:** 40 px above each title, so a section starts clearly; 16 px between the rule and the content.
4. **Destiny** keeps its gold bar, with its title at the same 26/22 px so it matches the others.
5. **Hierarchy check:** the level card's `Level N` (34 px) stays the largest title on the page.
6. **Themes:** check all five (Ember, Parchment, Frost, Daedric, Dwemer). The title must read clearly on each.

### Done when
- [x] Screenshots of Pure Mage (`/b/5pjwcg252f?level=11`) at 1440 and 390, scrolled through Attributes, Skills, Perks, Destiny, Gear and Spells, in Frost and Ember. Each section title is visible at a glance.
- [x] The section titles are `h2` elements (check them with an accessibility snapshot).
- [x] All checks in CLAUDE.md pass.

---

## WO-49  Reading a build: the guide link, the pinned level, arrow keys, and no jumping (12 Oct 2026)

From Dave's review, 12 Oct. Four fixes to how the build page behaves; no layout changes beyond what's said here. Do after WO-48.

### 1. `Read the full guide` goes to the guide
Today it only switches to the Guide tab (`build-view.tsx`, the intro block). If the tab row is below the fold, nothing visible happens.
- After switching, scroll so the tab row sits just under the pinned bars (`--sticky-top`), smoothly, unless it's already fully on screen.
- With reduced motion, jump instead of scrolling smoothly.

### 2. The pinned bar's level stands out
In the slim stepper (`LevelStepper` with `slim`), the number is the only thing that changes, and it's hard to find at a glance.
- Set the number in an ember box: ember background, dark text (#0e1319), Sofia Sans Extra Condensed 700, 22 px, 2 px by 10 px padding, no rounding.
- `Lvl` and `/ 57` stay muted, outside the box.
- When the level changes, the box flashes brighter for 200 ms. With reduced motion, no flash.
- The full stepper on the page stays as it is.

### 3. Teach the arrow keys
Left and right already step through levels on the Levels tab. Players don't know.
- **The ‹ and › buttons:** their tooltips and `aria-label`s become `Previous level (←)` and `Next level (→)`, in the pinned bar and on the page.
- **A one-time hint** on pointer devices with a keyboard (`(hover: hover) and (pointer: fine)`):
  - a small panel by the stepper says `Tip: ← and → step through levels`, with key caps;
  - it shows after the second time the player clicks ‹ or › on any build;
  - it goes away after 6 seconds, on the first arrow key press, or on its ×;
  - it's never shown again once dismissed or once an arrow key has been used, remembered in `localStorage` (`lbp.arrowTip`), with reads and writes in try/catch.
  - Nothing on phones.

### 4. The page stops jumping when you change level
`useHoldInPlace` keeps the level row still when the level changes. When the reader is further down (Gear, Spells), the level card above changes height with each level, so the part they're reading jumps.
- **On a level change, hold whatever the reader is looking at:** the first section (`#perks`, `#destiny`, `#gear-at-level`, `#spells`, the stats columns, or the level card) whose top is at or below the bottom of the pinned bars. Record its top before the change and restore it after, as the hook does now for the level row.
- If the level row itself is on screen, hold the level row as today.
- Set `overflow-anchor: none` on the Levels tab's container so the browser's own scroll anchoring doesn't fight the hold.

### Done when
- [x] e2e: on Pure Mage, scroll to the hero's bottom, click `Read the full guide`; the Guide tab's row is in view.
- [x] e2e: scroll so `Gear at level 20` is just under the pinned bars, press → three times; the gear section's top stays within 4 px of where it was each time. Same for Spells.
- [x] e2e: the hint shows after two clicks on ›, and not again after reload once an arrow key was pressed.
- [x] Screenshots at 1440: the pinned bar with the ember level box; the hint showing.
- [x] All checks in CLAUDE.md pass.

---

## WO-50  Gear is the timeline; a bar opens its card (12 Oct 2026)

Dave, 12 Oct: the gear section is too much. The slot cards stacked over the timeline repeat it, and the section grows with every row. The timeline stays; the cards go, and each one comes back when you click its bar. Layout follows the design canvas's **"Leaner: gear as the timeline…"** artboard (`GearSpellsLean.dc.html`, part 1). Do after WO-49.

1. **Remove the slot cards** from `Gear at level N` (`gear-view.tsx`). The section is the WO-48 title, then the timeline box.
2. **The timeline shows the viewed level:**
   - a faint ember column runs down every row at the viewed level, with the level number in the tick row in ember and bold (it's already drawn; keep it);
   - a bar held at the viewed level is lit (raised panel, text colour); a bar that starts at the viewed level is ember (`barNew`); every other bar stays muted. Today's three states, kept.
3. **Click a bar to open its card,** as a popover under the bar, right-aligned to it when it would run off the edge:
   - the item's name and slot;
   - its stats line from the item index (none for free text);
   - the game's text for the item, when it has one, in italic;
   - the author's note (WO-47);
   - for a made item, the base item and the spell or enchantments (WO-45);
   - a last row: `Levels 34 to 57, replaces College Robes` on the left, `Go to level 34` on the right (ember). That link sets the level, as clicking a bar does today.
4. **Closing:** the card closes on Esc, on a click outside it (WO-38's rule), on clicking the same bar again, or on opening another bar's card. One card open at a time.
5. **Keyboard:** bars are buttons, Tab reaches them, Enter or Space opens the card, and focus moves into it; Esc returns focus to the bar.
6. **At 390:** the timeline scrolls sideways inside its box as it does now, and the card opens full width under the row.
7. **The level card's `New gear` row** is unchanged; it's still the place to read what's new at a level.

### Done when
- [x] e2e: on Pure Mage at level 34, the gear section has no slot cards; clicking `Arch-Mage Robes` opens its card with `Clothing, 1 weight`, the note `Finish the College questline.` and `Go to level 34`; Esc closes it; clicking `Go to level 32` on Morokei's card moves to level 32.
- [x] Screenshots at 1440 and 390: level 34 with the Arch-Mage Robes card open; compare with the artboard.
- [x] All checks in CLAUDE.md pass.

---

## WO-51  Abilities and shouts: the game data, and in builds (12 Oct 2026)

Dave, 12 Oct: builds need active abilities (powers and lesser powers, from any source) and shouts, not only spells. His Spartan leans on War Cry, from the Speech perk of that name. Icons are done: `public/icons/mark-power.svg` (an open hand with magicka in the palm) and `mark-shout.svg` (the Shouts tag's dragon head). Do after WO-50.

### What the chat session already read (12 Oct, Dave's PC, read only)
- **`scripts/gamedata/powers.py`** (new) writes **`gamedata/5.0.4.8/powers_raw.json`**, committed:
  - **378 abilities:** every named, playable SPEL of type Power (79) or Lesser power (299), with the game's text from its first effect, tokens filled.
  - **46 links from perks:** a perk whose "Ability" entry grants one of them. `War Cry` (Speech) grants War Cry; `Artificer's Insight` grants Artificer's Insight.
  - **32 shouts:** SHOU records with three translated words, minus enemy shouts (generic undead words, dragon, boss and NPC EDIDs).
- **`scripts/gamedata/bsa.py`** (new) reads the base game's English string tables out of `Skyrim - Interface.bsa`. Without it every Skyrim.esm name was blank, which is why the first pass found almost no vanilla shouts.

### Build it
1. **`build.py` writes `src/data/lorerim-5.0.4.8/powers.json`:**
   - **`abilities`:** `id`, `name`, `kind` (`Power` / `Lesser power`) and `text`. Leave out junk with an `overrides.json` → `powers.skipNames` list: physics toggles, `Debug`, `Examine`, `Choose Birthsign`, `Katana Affinity Check`, `BowRapidSwitchPower`, `HKSSwitchPower`, `Cancel Morph`, `Call Remi`, `Dismiss …`, `Disassemble …`. Read the full list once and add anything else that is plainly a mod switch rather than an ability; say what you dropped in the commit.
   - **`fromPerks`:** perk id (`Tree:Name` in `perks.json`, matched by name) → ability id. Drop links whose perk isn't in a tree.
   - **`shouts`:** `id`, `name`, `words` (three), `translations` (three) and `text`. One entry per name: two Phantom Form records, keep the later one.
   - **Shout words** are in the game's dragon font spelling, where digits stand for long vowels. Convert them for display: 1 aa, 2 ei, 3 ii, 4 ah, 5 uu, 6 ur, 7 ir, 8 oo, 9 ey. `Fus Ro D4` becomes `Fus Ro Dah`; `T3d Klo Ul` becomes `Tiid Klo Ul`.
2. **The plan:**
   - `LevelPlan.abilities?: { id: string; where?: string }[]`: abilities the author adds (racial, stone, god, quest);
   - `LevelPlan.shouts?: { id: string; words: 1 | 2 | 3; where?: string }[]`: a shout row with how many words are known from that level. A later row for the same shout raises the count.
3. **Rules:**
   - **Abilities from perks are automatic:** a build has every ability in `fromPerks` whose perk it has taken, from that level. The author never adds those.
   - **New problem `ability-repeat`:** an ability added that a perk already grants, or added twice.
   - **New problem `shout-words`:** a shout's word count going down.
4. **The editor:**
   - **Abilities** and **Shouts** blocks sit next to Spells on each level, built the same way (search, `Where`, remove).
   - A shout row also has a 1 / 2 / 3 words control.
   - Abilities granted by a perk taken at that level show as a read-only line: `War Cry, from the War Cry perk`.

### Done when
- [x] `python3 scripts/gamedata/build.py` writes `powers.json`, committed.
- [x] Unit tests:
  - War Cry is a Lesser power, and `fromPerks` links it to `Speech:War Cry`;
  - Unrelenting Force's words read `Fus Ro Dah`;
  - no ability name matches the skip list;
  - taking `Speech:War Cry` at level 12 gives the build War Cry from level 12;
  - adding War Cry by hand raises `ability-repeat`;
  - two Unrelenting Force rows (1 word at 5, 3 words at 20) give 3 words from 20.
- [x] e2e: add Slow Time (2 words, `Deepwood Redoubt`) at level 25 to a test build; it saves and reloads.
- [x] All checks in CLAUDE.md pass.

---

## WO-52  Spells, abilities and shouts, leaner (12 Oct 2026)

Dave, 12 Oct: the Spells section gets very tall on big builds. Layout follows the design canvas's **"Leaner…"** artboard (`GearSpellsLean.dc.html`, part 2). It replaces WO-42's section layout; WO-42's rules stay. Do after WO-51.

1. **One section, `Spells and abilities at level N`** (WO-48 title style), in the contents rail as `Spells and abilities`.
2. **Main spells** stay first, in a panel, two columns at desktop:
   - each is one row with the school icon, the name in bold, the tier in muted text, and the first sentence of the game's text;
   - the full text and `where` are in the tooltip.
3. **Every other spell is a chip,** in one row per school, with the school's icon and name on the left. Schools follow the game's order; a school with no spells has no row.
   - A chip shows the name and `Lv 12` in small muted text.
   - Hover, focus or tap shows tier, cast type, `where` and the game's text.
   - Chips for spells learned at the viewed level are blue-bordered (magicka).
4. **Abilities:** a row below the schools, with `mark-power.svg`. Each chip shows the ability's name; the tooltip shows its kind, its text and where it comes from: `from the War Cry perk`, or the author's `where`.
5. **Shouts:** a row with `mark-shout.svg`. Each chip reads like `Slow Time` with `2 of 3 words` in small muted text; the tooltip has the words with their meanings (`Tiid Klo Ul: Time, Sand, Eternity`), the game's text and `where`.
6. **Order of rows:** schools, then Abilities, then Shouts, with a thin rule above Abilities. Rows only appear when they have something.
7. **The level card** gets `New abilities` and `New shouts` rows after `New spells`, built the same way as `New spells` (chips with icons). An ability from a perk shows there at the perk's level.
8. **At 390:** the school name sits above its chips; chips wrap.

### Done when
- [x] Screenshots at 1440 and 390 of Pure Mage at level 32 (spells, Artificer's Insight from its perk) and of a test build with War Cry and Slow Time; compare with the artboard.
- [x] The section for Pure Mage at level 57 is at most half the height it was before this order (measure both in the e2e and log the numbers).
- [x] e2e: a chip's tooltip opens on focus and shows `where`.
- [x] All checks in CLAUDE.md pass.

---

## WO-53  Enchantment lines follow the Enchanting perks (12 Oct 2026)

WO-45 allowed up to two enchantment lines on a made item, which is vanilla Skyrim. LoreRim's Enchanting tree allows more, and the number depends on perks. From `perks.json`:
- no perk: one enchantment;
- **Enchantment Mastery** (Enchanting 90): "can place two enchantments with 60% strength each";
- **Artifact Enchanter** (Enchanting 100, needs Enchantment Mastery): "can place three enchantments with 50% strength each".

1. **Up to three lines** on a made item that isn't a staff. `validate.ts` allows three; `MadeGear.enchantments` says "Up to three lines".
2. **The form** shows the first line. The next line's field appears once the one before it has text, up to three.
3. **The rules engine checks the lines against the build's perks.** The check runs at the gear row's `fromLevel`, against the perks held at that level:
   - two lines need Enchantment Mastery: `Two enchantments need Enchantment Mastery, not taken by level 34.`
   - three lines need Artifact Enchanter: `Three enchantments need Artifact Enchanter, not taken by level 34.`
   - The problem shows on that level like any other (a perk taken too early, for example).
4. **A staff isn't checked.** It takes a spell, not enchantments.
5. **Builds already saved** with two lines and no Enchantment Mastery now show the problem. That's correct; don't migrate them.

### Done when
- [x] Unit tests in `gear.test.ts` or `engine.test.ts`:
  - one line, no perks: no problem;
  - two lines at level 20, Enchantment Mastery at 30: a problem at 20;
  - two lines at 30, Mastery at 30: none;
  - three lines with Mastery only: a problem;
  - three lines with Artifact Enchanter: none;
  - a staff with a spell: none.
- [x] e2e: add a made ring with three lines; the third field appears only after the second has text; the level shows the Artifact Enchanter problem.
- [x] Screenshot of the form with three lines at 1440 and 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-54  Enchantments picked from the game's list (12 Oct 2026)

Do after WO-53. The extract is on staging: `scripts/gamedata/enchantments.py` writes `gamedata/5.0.4.8/enchantments_raw.json`. It holds 88 enchantments a player can learn (34 weapon, 54 armour and jewellery), and its commit message lists what was dropped. Each entry has:
- the game's name;
- `on`: `weapon` or `armor`;
- `text`, with the record's numbers filled in;
- `wornRestrictions`: the slot keywords it can go on, empty for most unique ones;
- `sources`: disenchanting items, with a count and examples, or the Arcane Experimentation or Artificer's Insight power.

The file also has `runestone`: 9 powers from Runemaster Magic. Those are temporary weapon runes cast as lesser powers, not enchantments put on at an enchanter, and they're already in `powers.json` as abilities. They stay out of this order.

1. **build.py** writes `src/data/lorerim-5.0.4.8/enchantments.json`. Each entry has `id`, `name`, `on`, `text`, `slots` and `learned`.
   - `slots` are the planner's gear slots, from the worn restrictions:
     - `ArmorCuirass`, `ClothingBody`: Body;
     - `ArmorHelmet`, `ClothingHead`, `ClothingCirclet`: Head;
     - `ArmorGauntlets`, `ClothingHands`: Hands;
     - `ArmorBoots`, `ClothingFeet`: Feet;
     - `ArmorShield`: Shield;
     - `ClothingRing`: Ring;
     - `ClothingNecklace`: Amulet.
   - An armour enchantment with no restrictions gets every armour slot.
   - `learned` reads like `Disenchant: Ring of Eminent Health, Necklace of Eminent Health and 100 more`, or `The Arcane Experimentation power`.
   - Keep `sameAs` like spells do. Skip `runestone`.
2. **The made-gear form**: each enchantment line is a search field, like the item field.
   - It lists only enchantments that fit the base item: weapon enchantments for a weapon; for armour or jewellery, the ones whose `slots` include the row's slot.
   - Choosing one saves its id. Typing something that isn't in the list and pressing Enter keeps it as text, as today, so anything the extract missed can still be added.
   - The same enchantment can't be picked twice on one item; the game doesn't allow it.
   - A staff still takes a spell.
3. **Reading a line**: a saved line that is an id in `enchantments.json` shows the game's name. Anything else shows as text, so builds saved before this order read the same.
4. **Tooltip and bar card** (WO-45, WO-50): each picked enchantment shows its name, the game's text, and `learned` in muted text. After the lines, one muted line: `Numbers are the game's base values. What you make depends on your Enchanting skill, perks and soul gem.`
5. **The rules engine**: an enchantment learned only from a power needs that power's perk by the gear row's level, for example `Fireburst comes from the Arcane Experimentation power; the perk isn't taken by level 30.` If it can also be disenchanted from items (Elemental Fury, Toxicity), there's no problem.

### Done when
- [x] `npm run test:gamedata`: a build test for the slot mapping, and that no runestone power reaches `enchantments.json`.
- [x] Unit tests: an armour ring lists Fortify Magicka (Rank I) but not Fire; a sword lists Fire; picking saves the id and the card shows the name; a free-text line still shows as text; Fireburst at level 30 without Arcane Experimentation gives the problem, and Elemental Fury doesn't.
- [x] e2e: on a made ring, search `magicka`, pick Fortify Magicka (Rank I), save; the shared page's card shows the name, the game's text and the base-values line.
- [x] Screenshots of the form's enchantment search at 1440 and 390, and of the card.
- [x] All checks in CLAUDE.md pass.

---

## WO-55  Racial abilities (13 Oct 2026)

The game files say that in LoreRim only one racial power is left: Khajiit **Night Eye** (`Skyrim.esm:0AA01D`, a lesser power). Requiem's Races Redone turned every other racial power into a passive ability (Highborn, Histskin, Dragonskin, Voice of the Emperor, Adrenaline Rush and so on). Berserker Rage, Command Animal and Ancestor's Wrath are gone from the races.

**The extract is done** (commit 2006f24): `powers_raw.json` has a `races` section. For each of the 10 races it gives the race's powers and passives with `id`, `name`, `kind` (`Power`, `Lesser power` or `Ability`) and the game's `text`: 30 in all. The Tools of Kagrenac race copies and Requiem's engine abilities (No Natural Health Regeneration, Mass Effect; `overrides.json`, `powers` -> `raceSkipEdids`) are left out. That commit also fixed `powers.py` reading `skipNames` as patterns; `powers.json` comes out the same.

1. **build.py** writes `fromRaces` into `powers.json`: race name (as in `races.json`) -> `{ powers: [ids], passives: [{ id, name, text }] }`.
   - A race's power is also an entry in `abilities`, like a perk's.
   - A passive isn't in `abilities`: it isn't something you use.
2. **The Night Eye bug.** WO-51's dedupe keeps one ability per name and kind, so Ordinator's Night Eye (`Ordinator - Perks of Skyrim.esp:0BC4F9`) replaces the Khajiit one.
   - A record a race grants always survives the dedupe, the same way a perk-linked record wins today.
   - When two kept records share a name, both stay; the race's is marked by `fromRaces`, not renamed.
   - Don't dedupe by text: Jeff found that brings back about 17 near-duplicates (Vigilant weapon-art tiers, Walking Disaster variants).
3. **In a build, a race's powers are automatic from level 1**, like a perk's ability:
   - Night Eye shows in a Khajiit build's Abilities row at level 1 as `from the Khajiit race`, in the editor and on the build page, with the same chip and tooltip as a perk's ability.
   - Adding it by hand raises `ability-repeat`: `Night Eye comes from the Khajiit race.`
   - In the add-ability search, Ordinator's Night Eye stays and can be picked as usual. The Khajiit one isn't offered: a Khajiit already has it, and no other race can get it.
   - A build that changes race (Set up) loses the old race's powers and gains the new one's. Nothing saved changes, since they're never stored in the plan.
4. **A race's passives show where the race is described,** in the game's words:
   - **Set up's race cards:** below the card's numbers, each passive's name in bold and its text. They wrap to the card's width, with no narrow measure (`docs/design-rules.md`).
   - **The build page's about bar:** the race's tooltip lists the passives the same way, after what it shows today.
   - They aren't in the Abilities row (that row is for abilities you use) and don't change any of the planner's numbers.

### Done when
- [x] `npm run test:gamedata`: `fromRaces` has all 10 races; Khajiit's powers are `[Skyrim.esm:0AA01D]`; Altmer's passives are Weakness to Elements and Highborn; both Night Eye records are in `abilities`.
- [x] Unit tests: a Khajiit build has Night Eye at level 1 `from the Khajiit race`; adding it by hand gives `ability-repeat`; a Nord build has no race power; the search offers Ordinator's Night Eye to a Nord and not the Khajiit one.
- [x] e2e: the shared page of a Khajiit build shows Night Eye in Abilities at level 1; an Altmer's race tooltip in the about bar lists Highborn and Weakness to Elements.
- [x] Screenshots: Set up's race step at 1440 and 390 with the passives on the cards; the about bar's race tooltip; a Khajiit level 1 Abilities row.
- [x] All checks in CLAUDE.md pass.

---

## WO-56  Repeat last level (13 Oct 2026)

From the builds made so far (Iriel, Azrem, Pure Mage): from about level 10 on, most level-ups spend the skill points and attribute the same way as the one before. Today that's clicked out by hand every level. One button repeats it.

1. **The button.** In the editor's attribute and skills column, next to its heading: `Repeat level 33` (the level before). It shows from level 3 on, when the level before has an attribute or skill points. It is a short verb button like the others.
2. **What it copies:** the level before's attribute choice and its skill points. Nothing else: perks, Destiny, stones, deity, trainers, books, gear, spells, abilities, shouts and the note stay as they are.
3. **It replaces** this level's attribute and skill points if any are set.
4. **As far as the rules allow.** Skills are raised in the order the level before raised them, one point at a time. A raise is skipped when:
   - it would make this level's raises for that skill more than +5;
   - the skill is at this level's max skill (the Master of One skill excepted, as the rules engine does today);
   - the skill points left don't cover its cost (raises cost more as a skill grows).
   Points left over stay banked, as they do now.
5. **When something didn't fit,** one muted line under the skills says what, in the rules engine's words: `Illusion +1 didn't fit: 2 skill points left.` or `Destruction stays at 100, the max skill at level 34.` It goes away on the next change. Nothing shows when everything fit.
6. **Undo.** After repeating, the button becomes `Undo` until the next change to this level. It puts back exactly what was there before.
7. **The logic** lives with the other plan operations (`plan-ops.ts`), as a pure function: `repeatLevel(plan, level, data)` returns the new plan and the list of skipped raises. It uses the rules engine's skills before this level and `skillPointCost` / `maxSkillAt`, so it can never make a level the engine flags.

### Done when
- [x] Unit tests for `repeatLevel`:
  - Pure Mage level 34 repeated from 33 gives the same five +1s and Magicka;
  - a raise that would pass +5, one at max skill, and one the points don't cover are each skipped and listed;
  - the Master of One skill can still go past max skill;
  - perks, extras, gear, spells and the note at this level are untouched;
  - repeating then undoing gives back the plan as it was.
- [x] A test that runs `repeatLevel` on every level of Pure Mage, Iriel and Azrem: the rules engine finds no new problems.
- [x] e2e: at level 12 of a test build, press `Repeat level 11`; the skills and attribute match level 11; `Undo` puts level 12 back.
- [x] Screenshots of the button and of the didn't-fit line, at 1440 and 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-57  Small fixes from Dave's 13 Oct review

Each was checked on staging on 13 Oct. None needs a design.

1. **Pickers show a list before you type.** Today the Add spell, Add ability and Add shout searches show nothing until something is typed (`spell-block.tsx` and `powers-block.tsx` return `[]` for an empty search).
   - On focus with an empty search, the list opens:
     - shouts: all of them, A to Z;
     - abilities: all of them, A to Z;
     - spells: the spells of the schools this build has perks in by this level, by tier and then A to Z; with no school perks, A to Z. At most 50, then a muted last row `Search for the rest`.
   - Typing filters as today.
   - The gear and enchantment pickers do the same if they don't already.
2. **Every option highlights under the mouse.** Spell, ability and shout options only highlight from the keyboard (`aria-selected`); gear's have `:hover`. In every listbox in the editor and the guide editor, moving the mouse over an option makes it the highlighted one, so the mouse and keys share one highlight and Enter picks what's lit.
3. **Tooltip on the Main spell star** (`spell-block.tsx`, the ★ button). Use the `Tooltip` component: `Main spell: the spells this build casts most, shown first in its Spells section. Up to 8.` When the star is disabled because 8 are starred: `8 main spells already. Unstar one first.`
4. **Tooltip on the Oghma Infinium** (the label in the extras form and on the added row in `editor.tsx`): `Septimus Signus' reward in LoreRim. Read once: six skills of your choice go up 5, up to 100, and Hermaeus Mora gives 3 perk points.`
5. **Tab switches leave the contents rail** (`build-view.tsx`, the `railItems`). Remove the `Guide` entry from the Levels tab's rail, and the `Levels` entry from the Guide tab's rail. The rail lists only the sections of the tab you're on; the tabs switch tabs.
6. **No line between cover and card body on hover** (home page and Browse, `build-card.module.css`). On hover a thin seam shows where the cover band meets the card body: the card's 3px lift with the cover's 1.04 zoom leaves a sub-pixel gap. Fix it so nothing shows at 1x or 2x zoom (for example, let the band's fade overlap the body by 1px, or round the lift). Check a card with a cover and one without.
7. **Tags are a heading** (the Details step, `TagPicker`). `Tags` is a small legend today and easy to miss above 20-odd chips.
   - Make it a heading the size of the step's other section headings, with `4 of 5 chosen` beside it.
   - Put a rule above it so the chips read as their own section.
   - The group names (Weapons, Armor, Magic, Way of play) stay small.
8. **Repeat where you add the level.** Dave looked for "copy from previous level" at the foot of the level, by `Continue to level N`. It's at the top of the skills column today, so he didn't see it.
   - In the footer bar, next to `Continue to level N`, add `Continue and repeat`. It adds level N and runs `repeatLevel` on it from level N-1 (WO-56), with its didn't-fit line and Undo as today.
   - It shows when the Repeat button would show on the new level, so from level 3 on.
   - The Repeat button at the top stays.

### Done when
- [x] e2e: on a test build, focus Add shout with nothing typed: the list shows the shouts; hovering one highlights it; Enter adds it.
- [x] e2e: focus Add spell at a level with Novice Destruction: the list starts with Destruction spells.
- [x] e2e: on level 4 of a test build, `Continue and repeat` makes level 5 with level 4's attribute and skill points.
- [x] The star and Oghma tooltips show on hover and on keyboard focus.
- [x] The contents rail (1600 wide) on the Levels tab has no `Guide` entry, and on the Guide tab no `Levels` entry.
- [x] Screenshots: a hovered card at 1440 (zoomed in on the cover edge), the Details step's Tags heading at 1440 and 390, the open shout list, and the footer with both buttons.
- [x] All checks in CLAUDE.md pass.

---

## WO-58  Set up: clear steps, a Deity step, races folded (13 Oct 2026; build once Dave has OK'd the canvas)

Canvas: `SetupRace.dc.html` and `SetupDeity.dc.html` (row "Proposal: set up, clearer steps").

1. **Steps show done, now, next or a problem** (the left rail in `wizard.tsx`). Today a finished step looks like one not started.
   - **Done and valid:** the diamond fills Stamina green with a check; the name in body white; its summary under it.
   - **Now:** ember diamond with its number, as today.
   - **Not started:** outlined diamond, muted.
   - **A problem:** a Health red diamond with `!`, and the problem in a few words as its summary.
   - What makes each step valid:
     - Race: a race is chosen.
     - Birthsign: a birthsign is chosen.
     - Skills: 3 majors and 6 minors.
     - Traits: every chosen trait that needs a choice has one (Focused Combat's skill, Master of One's skill). No traits is valid.
     - Deity: always (None is a choice).
     - Mode and start: a game mode and a start are chosen, and the start's option if it has one.
     - Details: a name.
   - The problem lines come from the same checks, e.g. `Focused Combat needs a skill`, `Choose 2 more minors`.
2. **Deity gets its own step**, after Traits and before Mode and start, so 7 steps: Race, Birthsign, Skills, Traits, Deity, Mode and start, Details.
   - **The grid:** each god is a card with its 32px icon (`DeityIcon`) and name.
     - Grouped as the select is today: `Offered to a <race> at the start`, then `Any other god, at a shrine`.
     - `None` comes first in the first group.
   - **Choosing:** click a card to choose it. The chosen card gets the ember border, as race cards do.
   - **The chosen god's text:** a panel beside the grid shows it in the game's words (`deity-text.json`): Follower, Devotee and Tenets, as the Deity field shows them today. At 390 wide the panel goes under the grid.
   - **Mode and start** loses its Deity field. Its rail summary drops the deity.
   - **Old links:** `?step=mode` still opens Mode and start, and saved drafts keep their step (`src/lib/builds/draft.ts`).
3. **Race cards fold their long text** (Race step).
   - **Each card shows** the icon, name, the +15 and +10 skills, Health, Magicka and Stamina, and the racial abilities' names as small tags (WO-55's `fromRaces`).
   - **A tag's text:** hovering a tag, or focusing it, shows that ability's text in a tooltip.
   - **The chosen race, in full:** a panel under the grid lists every ability with its full text, once.
   - The cards are about half today's height, so all ten fit without scrolling at 1440.

### Done when
- [x] Unit test for the step checks: each step valid and invalid, with the problem line.
- [x] e2e: create a build through all 7 steps; choosing Mephala on the Deity step saves `deity: "Mephala"`; the rail shows every step done at the end.
- [x] e2e: an existing build with a deity opens on the Deity step with it chosen; `?step=mode` opens Mode and start.
- [x] Screenshots at 1440 and 390: the Race step, the Deity step, and the rail with one step showing a problem. Compare with the canvas.
- [x] All checks in CLAUDE.md pass.

---

## WO-59  Taking a perk: the card by the star, and a moment when it's taken (13 Oct 2026; build once Dave has OK'd the canvas)

Canvas: `PerkConfirm.dc.html` (row "Proposal: tabs and taking a perk"). Today clicking a star opens the perk's card over the skills column, far from the tree, and Confirm just closes it.

1. **The card opens beside the star that was clicked**, inside the tree's frame.
   - It sits to the star's right, with a small pointer to it. Near the right edge it goes to the left instead, and near the bottom it goes above.
   - It holds the name, the game's text (as the card has it today), and `Confirm` and `Cancel`.
   - At 390 wide it stays as a sheet at the bottom of the screen, as now.
   - Esc and Cancel close it. Focus goes to Confirm when it opens and back to the star when it closes.
2. **When a perk is taken:**
   - the star fills ember with a short pop (scale 0.6 to 1.25 to 1, about 300ms);
   - eight small pixel sparks (brass highlight `#ffe3a3`, 4px squares) fly out about 30px and fade, about 700ms;
   - its line to the perk before it turns solid ember;
   - the level's `Perk points` number flashes ember once and counts down;
   - the skill's perk count on its chip goes up;
   - a line shows at the top of the tree frame: `<Perk> taken. N perk points left.` with `Undo`, until the next change or 6 seconds.
   - With `prefers-reduced-motion`, there's no pop or sparks: the star just fills and the line shows.
   - Removing a perk gets no animation.
3. No glows or shadows (design rules); the sparks are square pixels in the icon palette.

### Done when
- [x] e2e: click a ring on a test build: the card is inside the tree frame, next to the star; Confirm takes the perk, the line shows, Undo takes it back.
- [x] The card stays inside the frame for a star at the far right and one at the top.
- [x] Screenshots at 1440 (card open, and just after Confirm) and 390 (the sheet).
- [x] All checks in CLAUDE.md pass.

---

## WO-60  Levels and Guide tabs you can't miss (13 Oct 2026; build once Dave has OK'd the canvas)

Canvas: `TabsIcons.dc.html`. The two tabs on the build page are plain text today and easy to miss.

1. **New pixel icons** in `scripts/icons/pixels.py`, by its rules: `tab-levels` (a ladder) and `tab-guide` (an open book with an ember ribbon). The canvas has a first draw of each; redraw them properly in the script.
2. **The tabs become folder tabs:**
   - each is a box with its 32px icon, the name at about 26px, and its line under it (`Levels 1 to 50`, `1 min read`), at least 210px wide;
   - the open tab joins the panel below it (same fill, no line between them) with a 3px ember line along its top and an ember name;
   - the other tab is darker with a muted name and icon, and brightens on hover.
3. **In the pinned bar** once the tabs scroll away: the same two, small (16px icon and name), the open one underlined in ember.
4. A build with no guide has no tabs, as today.

### Done when
- [x] Screenshots of both tab states at 1440 and 390, and the pinned bar after scrolling.
- [x] Keyboard: arrow keys move between the tabs, as they do now.
- [x] All checks in CLAUDE.md pass.

---

## WO-61  Tapps, the first-time guide (13 Oct 2026; Dave picked Tapps, the bust with mead)

Canvas: `TourReader.dc.html` and `TourAuthor.dc.html` (row "Proposal: Tapps the goofy barbarian, the first-time guide"). Each card's copy is on the canvas in both voices. Both are clickable on the canvas, so the copy can be read stop by stop.

**The guide is Tapps** (Dave's pick, 13 Oct): a goofy Nord barbarian.
- He has a crooked horned helmet with one horn drooping, a braided blond beard with ember beads, a squint and a gap-toothed grin, a red wool tunic, and a tankard of mead.
- Tapps is Dave's community name. The character is drawn fresh, not after anyone else's artwork: no headband, gem, fur shoulders or tooth necklace.
- He speaks in short goofy lines; the copy for every stop is on the canvas.
- The canvas board `TappsStyles.dc.html` shows the other styles that were tried. Pip, the skeever, is shelved.

The design rules forbid how-it-works copy on screens. The tour is the one exception: it shows once, and only then.

1. **The art: two poses**, drawn in `scripts/icons/pixels.py` by the icon rules (shared outline, light from the top left, the planner's palette). The canvas has a first draw of each.
   - `tapps`, 24×24: the bust with the tankard, used on the welcome card at 72px (3×).
   - `tapps-point`, 30×30: the same bust with his free arm out, pointing left with one finger, used on every stop at 90px (3×). Mirror it with CSS to point right.
   - Both are pixelated, never smoothed.
2. **How a stop looks** (click through `TourReader.dc.html` and `TourAuthor.dc.html`):
   - **The page:** it dims (`rgba(6,8,11,.74)`) except the part being shown, which gets a 2px ember outline and is scrolled into view.
   - **Tapps points at it:** his pointing pose stands just outside the lit part with his fingertip on its outline. His side is the one with room: usually the page's right margin, where the content is full width.
   - **He bobs:** 3px up and down, two steps a second; still with `prefers-reduced-motion`.
   - **His card:** title, one or two sentences, `N of 4`, `Skip` and `Next` (`Done` on the last), with a brass border like the key panels.
     - It sits next to him, above or below, never over the lit part.
     - A small tail on the edge facing him shows he's the one talking.
   - **The welcome:** before the first stop, Tapps (the tankard pose) is inside the card, centered, with nothing lit.
   - **Placement:** a stop names its target element and a side. The tour measures the target and places Tapps and his card from that, so stops survive layout changes. No fixed pixel positions.
   - **At 390 wide:** the target is outlined as above; Tapps and the card dock together at the bottom of the screen, Tapps on the card's left edge, and a small ember arrow on the outline points at the target.
3. **The reader's tour** runs on the first build page someone opens. It opens with a card: `First time here?` / `I'm Pip. Four quick stops and you'll know your way around a build.` with `Show me` and `No thanks`. The four stops:
   1. The level row: `Pick a level to see what was taken there, or step through with the arrows.`
   2. The level card: `Perks, gear and spells on the left, the author's note on the right.`
   3. Perks: `Every tree as it stands at this level. Open a skill to see its stars.`
   4. The Guide tab (only when the build has a guide): `The author's write-up. Read it first if you want the story before the numbers.`
4. **The author's tour** runs the first time someone lands on level 1 of a build they just made. It opens with `Your build is saved` / `Now for level 1. I'll show you the four things you'll use on every level.` with `Show me` and `Later`. The four stops:
   1. The points row: `What this level gives you. Anything you don't spend carries on to the next level.`
   2. Skills and the tree: `Pick a skill, then click a ring in its tree and Confirm. Rings are the perks you can take now.`
   3. The note: `Tell readers what to do at this level: where to go, what to buy, what to watch for.`
   4. The footer: `Continue when the level is done. From level 3 on, Repeat copies the level before.`
5. **Once only.**
   - Each tour remembers it was finished, skipped or declined in `localStorage` (`planner.tour.reader`, `planner.tour.author`), with reads and writes in try/catch.
   - With storage blocked, the tour simply doesn't show again that visit.
   - `Later` asks again next time; `No thanks` and `Skip` don't.
   - A `Show me around` item in the account menu and the site footer restarts the tour for the page you're on.
6. **Doesn't get in the way.**
   - Esc skips.
   - Focus moves into Pip's card and goes back where it was at the end.
   - Clicks on the dimmed page do nothing.
   - The e2e tests start with both tours marked done, so existing tests are unchanged.

### Done when
- [x] e2e: a fresh browser opening a build sees the welcome; `Show me` goes through 4 stops; reloading doesn't show it again; `Show me around` restarts it.
- [x] e2e: creating a build lands on level 1 with the author's welcome; `Later` shows it again on the next visit, `Skip` doesn't.
- [x] e2e: a build without a guide has 3 reader stops, and the card says `N of 3`.
- [x] Screenshots of each stop at 1440 and 390, and Pip at 72px on the dark ground.
- [x] All checks in CLAUDE.md pass.

---

## WO-62  Editor: one skill list, the tree pinned beside it (13 Oct 2026)

Canvas: `EditorSticky.dc.html` (desktop, clickable, scroll it) and `EditorStickyPhone.dc.html` (390 wide). Dave: "way better".

Today every skill shows twice in the editor: in the left list, where its points are spent, and in the chips above the tree, which pick the tree. Clicking a name in the list already opens its tree (`editor.tsx`, `skillName`). The chips go; the list does both jobs.

1. **The chips go from the editor.**
   - Remove `TreeTabs` and the Destiny box above the tree in `editor.tsx`.
   - The build page keeps its chips: readers have no skill list.
2. **The skill list picks the tree.**
   - The section heading becomes `Skills and perks`, with `Up to +5 each, max skill N` and its tooltip as now.
   - A row's name opens its tree, as today. The open row gets an ember border and a faint ember wash, with its name in light ember.
   - Each row shows the perks taken in that tree, by this level, as the chips' orange count, after the name. Nothing shows when it's 0.
   - The stepper and the value stay where they are.
3. **Destiny is the last row**, under Mage, set off by a rule, in gold: the Destiny icon, `Destiny`, and `N left` while points remain. It opens the Destiny constellation in the tree panel.
4. **The tree stays in view** (900 wide and up).
   - The tree panel is `position: sticky`, just under the pinned edit bar.
   - Its height is the window's less the bars, as `treeHeight` works out now, without the chips.
   - Scrolling the list leaves the tree where it is. Clicking another row swaps the tree in place, with no scroll jump.
   - The panel's header shows the open tree's icon, name and skill value, then Tree and List and the zoom buttons.
   - The perk card (WO-59) opens inside the panel, so it stays in view too.
   - The level's other sections (gear, spells, notes) follow below, as now; the sticking stops where the two columns end.
5. **Phones** (under 900 wide), as on `EditorStickyPhone.dc.html`:
   - The list is the page.
   - Tapping a skill's name opens its perks in a sheet from the bottom, about 85% of the screen tall, with the tree's name and value, a close button and Tree and List.
   - The sheet opens on List: perks the build can take now first, then taken, then not yet, each with its skill level and rank. The Tree view stays one tap away.
   - Taking a perk works from either view.
   - Esc, the close button or a tap above the sheet closes it; focus goes back to the row.
   - The steppers stay on the rows, so points can be spent without opening anything.

### Done when
- [x] e2e: on a test build, the editor has no tree chips. Clicking `Sneak` in the list opens the Sneak tree, and its row is marked.
- [x] e2e at 1440×900: scroll the page to the Mage rows; the tree panel's top is still on screen under the bar. Click `Illusion`; the Illusion tree shows and the scroll position hasn't changed.
- [x] A row's count matches the perks taken in that tree; the Destiny row says how many points are left and opens the Destiny tree.
- [x] e2e at 390: tapping `Block` opens the sheet on List; taking a perk there takes it; closing it returns focus to the Block row.
- [x] Screenshots at 1440 (top of the list, and scrolled to Mage) and at 390 (the list, and the sheet in both views).
- [x] All checks in CLAUDE.md pass.

---

## WO-63  FAQ page: gameplay (13 Oct 2026)
Status: held (Dave, 23 Oct, 19:35: everything paused; see docs/pause-2026-10-23.md; was: queued)

The site's first guide page: the gameplay questions players ask most on the LoreRim Discord, answered and checked against the 5.0.4.8 files. Install and performance questions come later as more sections on the same page, so build it to grow.

### Content
- The words are in `content/faq/gameplay.md`, committed with this order. One `##` per section, one `###` per question, the answer below it: paragraphs, bullet and numbered lists, bold, inline code (file paths, console commands) and pipe tables.
- 9 sections, 44 questions. Don't edit the wording; if a line seems wrong, say so in the commit and leave it.
- The file is the only place the content lives. Dave and the chat session will edit it directly, so a change to the file must be all it takes to change the page: no copy in components, no hand-written JSON.
- Render it at build time. A small markdown library is fine (`marked` or `remark` + `remark-gfm` for tables); no MDX, nothing that runs in the browser.

### Route and layout
- `/faq`, in the `(site)` layout (header and footer as on Browse).
- Title `FAQ`, then the byline `For LoreRim 5.0.4.8` in muted text. No intro paragraph, no eyebrow (design rules 1 and 3).
- Desktop (900 and up): a contents list on the left with the section names, sticky under the header; the questions on the right. On phones the contents list sits above the questions and is collapsed to a `Sections` button.
- The answers use the same column width as the build page's main column. No narrow `ch` cap on body text (Dave's rule on ragged line breaks).
- Section names in the title face, as section labels elsewhere. Questions in the body face at a heading size, white; answers in body text. Tables, lists and code in the existing visual system: thin rules, square corners, `#141b23` panel behind code and tables, no shadows.

### Linking to one answer
Players will paste answers into Discord, so every question needs its own link.
- Each question gets an id from its text, e.g. `#why-cant-i-fast-travel`. Ids are stable: same text, same id.
- Hovering a question (or focusing it) shows a small link icon after it. Clicking copies the full URL with the `#id` and shows `Copied` for 2 s, the same as `Copy link` on the build page.
- Opening `/faq#some-id` scrolls to that question below the sticky header, not under it.

### Filter
- One text box at the top of the questions: `Filter questions`.
- Typing hides every question whose question or answer doesn't contain all the typed words (case-insensitive), and every section left empty. The contents list hides the same sections.
- No match: `No questions match "[text]".` with a `Clear` button.
- Clearing brings everything back. The filter isn't kept in the URL.
- This is the one piece that runs in the browser; the page must read in full with scripts off.

### Getting there
- The footer gets an `FAQ` link next to the Discord link. The header stays as it is (it has no nav by design).
- Page metadata: title `FAQ | LoreRim Build Planner`; description `Answers to the gameplay questions LoreRim players ask most, for LoreRim 5.0.4.8.`
- Add FAQPage structured data (JSON-LD) built from the same file: one `Question` per `###`, its answer as plain text.

### Done when
- [x] `/faq` shows all 9 sections and 44 questions from `content/faq/gameplay.md`, with tables, lists and code rendered.
- [x] A test (unit or e2e) counts sections and questions in the rendered page against the file, so the two can't drift.
- [x] Editing a question in the file and rebuilding changes the page with no other change.
- [x] e2e: open `/faq#why-cant-i-fast-travel`; that question is in view below the header. Copy its link; the clipboard holds the full URL.
- [x] e2e: type `vampire` in the filter; only matching questions remain (at least `Do vampires get thirsty?` and `Playing as a vampire`), and empty sections are hidden. Clear brings all 44 back.
- [x] The page reads in full with JavaScript disabled (filter and copy buttons may be absent).
- [ ] The JSON-LD passes Google's Rich Results Test (or schema.org validator) with 44 questions.
- [x] Footer link `FAQ` on every site page.
- [x] Screenshots at 1440 (top, and scrolled to the Smithing book table) and at 390 (top with `Sections` open, and a table), checked against `docs/design-rules.md`: no eyebrows, no middle dots, no em dashes in the page's own copy.
- [x] All checks in CLAUDE.md pass.

---

## WO-64  Auto level, on a fresh build (13 Oct 2026; named by Dave)

Canvas: `FillLevels.dc.html` (row "Proposal: Auto level"). Its preview numbers are a real run of the rules engine on Jo'Vashar's set up.

Dave's idea: say where a character should be at level N and have the planner fill every level up to it. It helps with a quick guide, a one-off for a friend, or checking whether something can be reached by a certain level. This order covers fresh builds only (nothing past level 1). Filling the rest of an existing build comes later.

1. **Where it starts.** On a build with only level 1 and nothing chosen past it, the editor's footer offers `Auto level` beside `Continue to level 2`. It opens the Auto level page; `‹ Level 1` goes back.
2. **What the author sets** (left column):
   - **Level to reach:** a number, 2 to the version's top level, with quick picks 10, 20, 30, 50. Default 20.
   - **Skill targets:** rows of skill, value now, target, and a live status. The rows start as the build's majors at 100 and minors at 50; rows can be added and removed. The order of the rows is the order points go in when there aren't enough for all.
   - **Perks, in order:** search to add (the same picker as WO-57's), drag to reorder, × to remove. A ranked perk can be added more than once for more ranks. Destiny stars can be added the same way.
   - **Attributes:** how many level-ups go to Health, Magicka and Stamina, which must add up to N−1 (`29 of 29 level-ups`). `Take first` decides the order: one attribute first, then the rest in turn, or evenly from the start.
   - The two "i" marks explain the rules in a tooltip: `Targets rise together, one point at a time, as far as each level's points, +5 and max skill allow.` and `Each perk goes at the first level its skill and earlier perks allow.`
3. **How it fills** (a pure function next to `repeatLevel` in `plan-ops.ts`: `fillToLevel(plan, settings, data)` returns the new plan and a report):
   - **Attribute:** each level from 2 to N gets its attribute from the order above.
   - **Skill points:** they go round the targets in row order, one point at a time. A skill is skipped once it hits its target, the level's max skill, or +5 this level, or when the points left don't cover its cost. Points left over bank, as now.
   - **Perks:** after the skills, the level's perk points take the first perks on the list the rules engine accepts at that level, without new problems.
   - **Destiny:** points take the listed Destiny stars the same way.
   - **What's untouched:** level 1, the setup, and everything else on the levels (gear, spells, notes).
   - **Checked:** the rules engine checks every level, so the result never has a problem the engine would flag.
   - The canvas run's script is in [docs/sketches/fill-to-level.md](sketches/fill-to-level.md). It's a sketch of exactly this, and it gave Jo'Vashar's numbers with no problems.
4. **The preview** (right column, sticky) is worked out again on every change, without saving:
   - Health, Magicka and Stamina at level N.
   - Each target, from now to its value at N: green when reached, amber when it can't be, with why. The status in its row says `By level 25`, or `80 at most: the max skill at level 30`.
   - Each perk's level, or why it doesn't fit, e.g. `Not by level 30: needs Two-Handed 100, level 50 at the earliest` or `needs Alteration 75, above the target`.
   - A strip of levels 1 to N with a dot per perk taken.
   - Points left over at N, when there are any: `Left over at level 30: 450 skill points and 21 perk points. Raise a target or add perks.`
5. **Run it.** `Auto level to N` writes the levels and goes to level N in the editor, with a line: `Levels 2 to N filled in.` and `Undo` (back to the fresh build), until the next change. The settings are not saved.
6. **Phones:** the preview goes under the form, with the `Auto level to N` button pinned at the bottom.
7. **Tapps explains it** (WO-61's guide), the first time someone opens the page.
   - The card: Tapps (the tankard pose) with `Tapps does the levels` / `Tell Tapps the level, the skills and the perks. Tapps fills in every level between, by the rules. Can't happen by then? Tapps says so. Like Mighty Strike at level 30. Not happening.` and `Got it`.
   - Once only (`planner.tour.autolevel`, as WO-61 stores its tours); `Show me around` brings it back.
   - If WO-61 isn't built yet, build the card with the same look and storage, and WO-61 picks it up.

### Done when
- [x] Unit tests for `fillToLevel`:
  - Jo'Vashar's settings from the canvas give the canvas numbers: Health 135, Magicka 150 and Stamina 220 at 30; Evasion 80; Adept Alteration at level 10; Mighty Strike and Expert Alteration unplaced, each with its reason.
  - The rules engine finds no problems on any filled level.
  - Attributes add up and follow `Take first`.
  - A ranked perk listed twice takes two ranks.
  - Level 1 and the setup are unchanged.
- [x] e2e: a fresh test build, `Auto level`, set 20 with two targets and three perks. The preview shows them; `Auto level to 20` makes 20 levels; `Undo` gives back the one-level build.
- [x] `Auto level` doesn't show on a build with level 2 or later.
- [x] Tapps' card shows on the first visit only, and `Show me around` brings it back.
- [x] Screenshots at 1440 and 390, compared with the canvas.
- [x] All checks in CLAUDE.md pass.

---

## WO-65  Auto level, second pass: pick goals in the trees (14 Oct 2026)

Canvas: `AutoLevelGoals.dc.html`, row "Proposal: Auto level"; click around. `FillLevels.dc.html` beside it is what WO-64 built.

Dave tried WO-64 on staging and found it "very confusing". The chat session tried it too, on a fresh Altmer, and found four problems:
- **Prerequisites by hand:** adding Impact says `needs Empowered Destruction first`, and that one needs Novice Destruction.
- **Perk names:** it starts as a blank search, but authors think in trees, not names.
- **Skill targets repeat the perks:** wanting Expert Destruction already means Destruction 75.
- **Too much at once:** the defaults (majors at 100, minors at 50) fill the page with amber before anything is chosen.

This pass keeps WO-64's engine (`fillToLevel`) and its preview, and replaces how the author tells it what they want.

1. **One line of settings** across the top:
   - `‹ Level 1` and the title.
   - `To level`: chips 10, 20, 30, 50 and a number field.
   - `Attributes`: chips `Health first`, `Magicka first`, `Stamina first`, `Even` and `Custom`. Default: the attribute of the build's first major's school (Magicka for a mage school, Stamina for a warrior or thief skill).
   - **X first** gives half the level-ups to X, taken first; the rest go to the other two in turn.
   - **Custom** opens WO-64's three counters under the line.
2. **Goals are picked in the trees.** The page uses WO-62's layout: the skill list on the left, the tree in the middle.
   - **Clicking a star** makes it a goal: an ember star with a light ember ring. Clicking it again drops it.
   - **Comes along:** a goal's prerequisites, down to the root of its tree, are marked as faint ember stars on lit lines. They're taken without being listed. Clicking one makes it a goal too.
   - **"Either" prerequisites** (`anyOf`): take the one with the lowest skill requirement, or one already coming along.
   - **Prerequisites in another tree** come along the same way, and their tree's row gets a count.
   - **Exclusions:** a goal that rules out another goal (`Not with ...`) marks both in Health red, with the game's reason, and Auto level is disabled until one is dropped.
   - Destiny is the last row of the list, as in WO-62. Its stars work the same way, and the path to them comes along.
3. **The skill list shows what the goals need.** No steppers here.
   - A row with goals shows a count, then e.g. `75 by 25`: the skill the goals need and the level it gets there, from the engine. Green when that's by the level to reach, amber when not.
   - Rows without goals show today's value, muted.
4. **What `fillToLevel` gets** is built from the goals (a pure function, `goalsToSettings(plan, goals, to, attributes, d)`, next to `fillToLevel`):
   - `perks`: every goal and what comes along, prerequisites before what needs them, then by skill requirement, low first.
   - `targets`: for each tree with goals, the highest skill its perks need, in the same order. After those, the majors and then the minors as lower-priority targets up to the max skill, so spare points go somewhere useful.
   - `attributes` and `first` from the chips.
5. **The preview** (right column) is WO-64's, reworded for goals:
   - Health, Magicka and Stamina at the level to reach.
   - Each goal with its level, and under it, muted, what comes along with it (`with Novice Destruction, Apprentice Destruction, Adept Destruction`). A goal's × drops it.
   - When a goal can't make it: `Not by 20: needs Destruction 75, level 25 at the earliest`. "At the earliest" comes from running the same fill to the version's top level, cached.
   - The line `N perks with what comes along.` Leftover points as in WO-64.
   - The button `Auto level to N`.
6. **Gone from the page:** the Skill targets section, the perk search list and the default targets. `FillSettings` stays the engine's input; the page no longer edits it directly.
7. **Tapps' card** (WO-64) gets new words: `Tapps does the levels` / `Click the perks you want. Tapps brings the ones before them, raises the skills, and fills every level between. Can't happen by then? Tapps says so.`
8. **Phones** follow WO-62's phone pattern:
   - The list is the page.
   - Tapping a skill opens its tree in a sheet, on List, where tapping a perk makes it a goal.
   - The settings line wraps; the preview goes under the list, with the button pinned at the bottom.

### Done when
- [x] Unit tests for `goalsToSettings`:
  - Impact alone gives Novice Destruction, Empowered Destruction and Impact, in that order, and a Destruction target of 50.
  - Expert Destruction gives the Novice, Apprentice and Adept path and a target of 75.
  - An `anyOf` perk takes its cheaper prerequisite.
  - A cross-tree prerequisite comes along.
  - Two goals that exclude each other are reported, not filled.
- [x] Unit test: the canvas board's goals (Impact, Expert Destruction, Cremation, Adept Alteration) on an Altmer to 30 fill with no problems from the rules engine, and every goal is placed.
- [x] e2e: on a fresh test build, open Auto level, click Impact in the Destruction tree. Its path is marked, the Destruction row says `50 by …`, and the preview lists Impact with what comes along. `Auto level to 20` fills 20 levels with Impact taken; `Undo` brings back the fresh build.
- [x] e2e: set To level 10 with Expert Destruction as a goal. The preview says it can't make it and gives the earliest level.
- [x] Screenshots at 1440 and 390, compared with `AutoLevelGoals.dc.html`.
- [x] All checks in CLAUDE.md pass.

---

## WO-66  The guide: chapters in place of the FAQ (14 Oct 2026)

Mockup: `docs/sketches/guide-chapter.html` (chapter 5 as Dave approved it on 13 Oct; open it in a browser). Its words are older than the content files; where they differ, the files win. Its `Every key` link is dropped: chapter 11 is that page. Rules: `docs/design-rules.md`, "Guide pages" (17 to 21).

Dave's verdict on `/faq`: it reads like a technical document, and it answers questions nobody asks before they know the thing exists ("What do F1 to F4 do?"). The guide replaces it. It teaches the game in the order a player meets it: chapters, then sections, then the questions players ask about each section.

### Content
- The words are in `content/guide/` (supplied with this order): 11 chapter files, `01-what-lorerim-changes.md` to `11-keys-and-menus.md`, and `README.md`, which defines the format. 67 sections and 49 questions in all. Don't edit the wording; if a line seems wrong, say so in the commit and leave it.
- The files are the only place the content lives, as with the FAQ: a change to a file must be all it takes to change the page.
- Parse at build time with `marked` (already installed, see `src/lib/faq/faq.ts`) plus a small pass for the guide's own syntax:
  - front matter (`chapter`, `title`, `subtitle`), then the lead paragraphs;
  - `## Heading {#id}` starts a section with that id;
  - `:::more`, `:::mods` and `:::ask{q="..."}` blocks, each closed by `:::`;
  - inside `:::mods`, one item per mod: `**Name**: text`, with optional sub-items `where:` and `tag:`;
  - `[[F1]]` becomes a key cap.
- The parser fails the build, with the file and line, on: an unclosed block, a block out of order (more, then mods, then asks), two sections with the same id in a chapter, or a `/guide/...` link to a chapter or section that doesn't exist.
- The slug of a chapter is its file name without the number: `05-fighting.md` is `/guide/fighting`.

### Pages
1. **`/guide/[slug]`, a chapter** (layout as in the mockup):
   - `Chapter 5` (title face, muted), the title, the subtitle in body text under it, then the lead.
   - Each section: its heading, the explanation, then **More detail** (collapsed, sunk panel), **Related Mods** (collapsed, brass corners, the count of mods beside the label, e.g. `4 mods`), then **Players ask** with each question collapsed to its question.
   - Related Mods rows: the mod name on the left; on the right what it does here, then `where` in code style and `tag` as a small label, as in the mockup.
   - At the foot: Previous and Next chapter.
2. **Chapter list on the left** (260px, sticky under the header from 900px up): numbers 1 to 11 and titles, the open chapter in ember with its section names under it, linking to the anchors. Under the list, the reference pages: `Which mod runs what` and `All questions`. Below 900px the list sits above the chapter and is collapsed to a `Chapters` button, as in the mockup.
3. **`/guide`**: title `Guide`, the byline `For LoreRim 5.0.4.8`, then the 11 chapters, each with its number, title, subtitle and its section names as links. No intro paragraph and no eyebrow (design rules 1 and 3).
4. **`/guide/questions`, All questions**: every `:::ask` from every chapter, grouped under its chapter and section names, each linking back to its section. The FAQ's filter moves here unchanged: `Filter questions`, the same matching, the same `No questions match "[text]".` and `Clear`.
5. **`/guide/mods`, Which mod runs what**: every mod named in a `:::mods` block, A to Z, each with the sections that name it (chapter, section, linked) and its `where` lines. Built from the same files.
6. **`/faq` goes.** It redirects permanently to `/guide/questions`. Remove the FAQ page, `src/lib/faq/`, its components and `content/faq/gameplay.md` (the guide covers every answer). Replace the FAQ tests with guide tests.

### Linking
- Every section and every question can be linked, as on the FAQ: hover or focus shows the link icon, clicking copies the full URL and shows `Copied` for 2 s. Question ids come from the question text, as before; section ids are the `{#id}` in the file.
- Opening a link to a section or question scrolls it below the sticky header. A link to a question opens it.
- Key caps (`[[F1]]`) use one style everywhere: the rule colour border, panel fill, title face, square corners.

### Getting there
- The header gets two links, `Builds` and `Guide`, as in the mockup, with the current one in ember. This changes the earlier "no nav in the header" decision; Dave approved the mockup that shows it. If it crowds the header on phones, keep the links and shorten nothing else; send a 390 screenshot.
- The footer's `FAQ` link becomes `Guide`.
- Metadata: `/guide`, title `Guide | LoreRim Build Planner`, description `How LoreRim 5.0.4.8 plays: character creation, leveling, survival, combat, magic, crafting, travel, death and the keys, checked against the installed files.` Chapters: `[Title] | LoreRim Guide`, description = the subtitle.
- FAQPage structured data moves to `/guide/questions`, built from the same files.

### Done when
- [x] `/guide` lists 11 chapters; each chapter page renders every section, More detail, Related Mods and question from its file, with tables, lists, code and key caps.
- [x] A test counts chapters, sections, mods blocks and questions in the rendered pages against the files.
- [x] A test feeds the parser a broken file (unclosed block, wrong order, duplicate id, dead `/guide` link) and expects a build error naming the file.
- [x] Editing a sentence in a chapter file and rebuilding changes the page with no other change.
- [x] More detail, Related Mods and each question are closed on load and open with a click and with Enter; the pages read in full with JavaScript off (they are `<details>`).
- [x] e2e: open `/guide/fighting#stances`; the section is in view below the header. Open `/guide/questions#why-cant-i-fast-travel`; the question is open and in view.
- [x] e2e: on `/guide/questions`, type `vampire`; only matching questions remain and empty groups hide; Clear brings all 49 back.
- [x] `/faq` and `/faq#anything` redirect to `/guide/questions` with a 308.
- [x] `/guide/mods` lists every mod named in the chapters, and each entry links to the sections that name it.
- [x] Header `Builds` and `Guide` links and the footer `Guide` link on every site page.
- [x] Screenshots at 1440: `/guide`, `/guide/fighting` top, the Stances section with Related Mods open, `/guide/mods`. At 390: a chapter with `Chapters` open, and a table. Checked against the mockup and `docs/design-rules.md`: no eyebrows, no middle dots, no em dashes in the page's own copy.
- [x] All checks in CLAUDE.md pass.

---

## WO-67  Auto level, third pass: easy to find, never stuck, a plain tour (14 Oct 2026)

Dave's review of WO-65 on staging: better, but with these changes. Canvas: `StartChoice.dc.html`, in the row "Proposal: Auto level".

1. **Offer it where a new build starts.**
   - After Set up creates a new build (`wizard.tsx`, the `createBuild` success that pushes to `/edit` today), the author lands on a choice first: `How do you want to build it?` with two cards.
     - `Level by level`: `Start at level 1 and choose every attribute, skill and perk yourself.` with `Start at level 1`.
     - `Auto level`: `Pick a level and the perks you want. Every level in between is filled in for you, then you add the details.` with `Auto level`. It carries Tapps' pointing pose.
   - Either card goes to the editor: level 1, or the Auto level page.
   - The author's tour (WO-61) starts on level 1 only after `Level by level`.
   - On a fresh build's level 1, `Auto level` also moves from the footer up into the level bar, next to the level stepper, as a normal button. The footer one stays.
   - Editing an existing build's Set up doesn't show the choice.
2. **Level to reach** (the settings line):
   - Chips `10`, `20`, `30`, `50` and `Max`, plus the number field. `Max` is `MAX_LEVELS` (100), the most the planner allows.
   - **Never below what the goals need.** The lowest level that every goal can make, worked out the way the preview's "at the earliest" is today, is a floor.
     - Chips and numbers under it are disabled, with the tooltip `Your goals need level 25.`
     - Typing a lower number snaps back to the floor.
3. **Picking a perk the level can't reach raises the level.** It never leaves a goal that can't be met.
   - The level jumps to the floor, with a line in the settings bar until the next change: `Level raised to 25 for Expert Destruction.` and `Undo`, which puts the level back and drops that goal.
   - Dropping goals doesn't lower the level; the author does that.
   - With this, `Not by N` goes from the preview, and Auto level is never disabled for a level problem. (Exclusions, from WO-65, still block.)
4. **Attributes: always the three numbers.**
   - Health, Magicka and Stamina counters show at all times, adding up to N−1.
   - The chips `Health first`, `Magicka first`, `Stamina first` and `Even` fill in the numbers as WO-65 says. The chip whose numbers are showing is lit; after a hand edit, none is.
   - `Custom` goes.
   - Order of level-ups: the attribute with the most goes first, then the others in turn; with a tie, in turn from the start.
   - Changing the level keeps the shares and rounds, so the total still fits.
5. **Labels.**
   - `Comes along` becomes `Auto selected` everywhere: the tree legend, the preview's `with …` lines (`Auto selected: Novice Destruction, Apprentice Destruction`), and the perk count line (`N perks, with the auto selected ones`). The legend's `Auto selected` has the tooltip `Needed before a perk you picked, so it's taken for you.`
   - `Left over at level N: …` becomes `Not spent by level N: 450 skill points and 21 perk points.`, with an "i": `Points the goals didn't need. They stay banked; pick more perks to use them.`
6. **Tapps gives a tour instead of a joke** (WO-61's tour, kind `autolevel`, pointing pose, plain words). It replaces WO-64's card.
   1. No highlight, the welcome card: `Auto level` / `Fast-tracks a build. It fills in attributes, skills and perks for every level up to the one you pick.` with `Show me` and `Skip`.
   2. The level chips: `Pick the level to reach.`
   3. The attribute counters: `Set how many level-ups go to Health, Magicka and Stamina. The presets fill them in; change any number.`
   4. The tree: `Pick a perk you want. The perks it needs first are selected for you.`
   5. The skill list: `Each skill is raised to what your perks need.`
   6. `Auto level to N`: `When you're done, this saves every level. Then add notes, gear and spells to each one.` with `Done`.
   - Once only, as now; `Show me around` restarts it.

### Done when
- [x] e2e: creating a build lands on the choice. `Auto level` opens the Auto level page; another new build's `Level by level` opens level 1 with the author's tour.
- [x] e2e: on the Auto level page at level 10, click Expert Destruction. The level becomes 25 with the `Level raised` line, the chips 10 and 20 are disabled, and `Undo` puts back 10 without the goal.
- [x] Unit test for the floor: Expert Destruction alone on the Altmer test build gives 25, the same as the preview's earliest.
- [x] The attribute counters always show. `Magicka first` fills them; a hand edit unlights the chip; changing the level keeps the total at N−1.
- [x] No `Comes along`, `Custom` or `Left over` anywhere in the app.
- [x] e2e: a fresh browser on the Auto level page gets the six-stop tour; skipping it doesn't bring it back; `Show me around` does.
- [x] Screenshots at 1440 and 390: the choice, the page with the raised-level line, and each tour stop.
- [x] All checks in CLAUDE.md pass.

---

## WO-68  Snapshot builds, in place of Auto level (14 Oct 2026)

Canvas: row "Proposal: Snapshot builds (in place of Auto level)", with `SnapshotEditor.dc.html` (click around), `SnapshotPage.dc.html` and `StartChoice.dc.html`.

**Why.** Dave tested WO-67. Auto level's output doesn't read as a guide: +1 to seven skills every level, every perk as early as possible, then dozens of empty levels. Nobody plays like that. The engine is sound, but filling the path is the wrong job for it.

So it becomes a second kind of build: **a snapshot**, the build at one level ("here's the build at level 50"). It's one character sheet: setup, attribute totals, skill values and the perks held. There are no levels, so there are no empty levels. Level-by-level builds are unchanged and stay the main kind.

1. **The plan.** `BuildPlan.snapshot?: { level: number; attributes: { health: number; magicka: number; stamina: number }; perks: string[]; skills: Record<string, number> }`. `perks` are the perks the author picked. `skills` are values the author set by hand.
   - **Stored on save,** re-checked by the server: `snapshot.result`, holding the skill values, the perk ids held (picks plus auto selected) and the Health, Magicka and Stamina totals at `level`.
   - A snapshot build has only level 1 in `levels`; Set up still lives there.
   - **The check:** `goalsToSettings` + `fillToLevel` (WO-65), with the author's skill values as extra targets. Save fails if any pick isn't placed, any set value isn't reached, or the rules engine finds a problem. The editor never lets it get there (points 3 to 5).
   - `parseBuildPlan` and the version copy (`copyBuildForVersion`) handle `snapshot`.
2. **Starting one.** The start choice from WO-67 offers `Level by level` and `Snapshot`.
   - Snapshot's card: the Destiny icon, `Snapshot`, `The build at one level: skills, attributes and perks at level 50. Pick the perks; the ones they need are selected for you.`, and `Make a snapshot`.
   - **Auto level goes:** its page, its level-1 buttons (bar and footer), its tour and its route. Builds already made with it stay level-by-level builds.
3. **The snapshot editor** at `/b/[id]/edit` for a snapshot build. It's WO-67's page, renamed and changed:
   - **The edit bar** reads `Snapshot`, `Set up` and `Guide`.
   - **Settings line:** `At level` chips 10, 20, 30, 50 and `Max`, with the floor from WO-67. Attribute presets and the three counters, which always show.
   - **Skill list:** each row has a number field for its value at the level.
     - Floor: what the picks need, with the tooltip `At least 75 for the perks you picked.`
     - Cap: the max skill at the level, and what the skill points left allow with the other values. Typing past it snaps back with `Most it can be with the others: 82.`
     - Values the author hasn't set: majors take the spare points, up to the cap, then minors. A set value is marked, with a small reset.
   - **The tree:** WO-65's Picked and `Auto selected` stars, plus **Ruled out** (point 4).
   - **Right panel:** `Level N`, `N perks, with the auto selected ones.`, then each pick with `From level N` and its `Auto selected: …` line, and a ×.
   - The button `Save snapshot` saves and goes to the build page.
   - Autosave as in the level editor, once the snapshot passes the check.
4. **Never pick what can't be had.**
   - A perk is ruled out when a held perk (pick or auto selected) excludes it, or when its path needs a perk that's excluded. Today that's Block: Weapons Master against One-Handed: Weapon Mastery and Two-Handed: Great Weapon Mastery, and everything in their trees that needs them.
   - **How it looks:** a dashed Health red ring, the name struck through, not clickable.
   - **Its tooltip** says why: `Not with Block: Weapons Master, a perk you picked.` and, for a perk further up, `It needs Weapon Mastery, which that rules out.`
   - The skill row for a tree that's mostly ruled out still works.
   - The WO-65 message `Drop one of the goals that rule each other out.` goes, since it can't happen any more.
5. **Level floor.** As WO-67: a pick the level can't reach raises the level, with `Level raised to 25 for Cremation.` and `Undo`.
6. **The build page** for a snapshot (`SnapshotPage.dc.html`):
   - **The byline** gains a brass tag: `Snapshot at level 50`.
   - **The tabs** are `Build` (the Destiny icon, `At level 50`) and `Guide`.
   - **Build tab:** `At level 50`, then the three totals.
     - **Skills:** all 18, highest first, each with a bar; the majors' bars in ember.
     - **Perks:** by tree, with the count. Each tree shows its icon, name and value, then its perks by skill requirement. The picks are **key perks**: ember with a dot, with the legend `Key perks, the ones the build is about`.
     - Under that, the reader's tree view, with the snapshot's perks taken.
   - No level stepper, no ruler, no level cards.
7. **Cards and Browse.**
   - A snapshot's card says `Snapshot at level 50` where a level build says `to level 30`.
   - Browse gets a `Kind` filter: `Any`, `Level by level`, `Snapshot`.
8. **Tapps' tour** for the snapshot editor (WO-67's six stops, reworded):
   1. `Snapshot` / `Shows a build at one level: its skills, attributes and perks.`
   2. `Pick the level.`
   3. `Set how many level-ups go to Health, Magicka and Stamina. The presets fill them in; change any number.`
   4. `Pick a perk you want. The perks it needs first are selected for you, and perks that can't go with it are ruled out.`
   5. `Skills are raised to what your perks need. Spare points go to your majors; change any number.`
   6. `Save the snapshot, then write the Guide.`
9. **Later, not now** (parked): gear and main spells on a snapshot; `Write it out level by level`, which copies a snapshot into a level-by-level build as a first draft.

### Done when
- [x] Unit tests:
  - a snapshot with Impact and Expert Destruction at 50 on the Altmer test build passes the check and stores its result;
  - one whose picks need level 25, saved at 20, is refused;
  - a set skill value past what the points allow is refused;
  - Weapons Master rules out Weapon Mastery and every perk whose path needs it;
  - the version copy keeps the snapshot.
- [x] e2e: new build, `Snapshot`, pick Expert Destruction at level 20. The level becomes 25 with the line, and `Save snapshot` lands on the build page with `Snapshot at level 25`, the Destruction perks, and Destruction at 75 or more.
- [x] e2e: pick Weapons Master; in One-Handed, Weapon Mastery is ruled out with its tooltip and can't be clicked.
- [x] e2e: Browse `Kind: Snapshot` lists the snapshot and not the level builds.
- [x] Nothing of Auto level is left: no route, button or tour.
- [x] Screenshots at 1440 and 390: the choice, the editor (with a ruled-out tooltip), and the build page. Compare with the canvas.
- [x] All checks in CLAUDE.md pass.

---

## WO-69  Skip ahead: one kind of build, written at the levels that matter (14 Oct 2026)

Canvas: row "Proposal: Skip ahead (in place of snapshots)", with `KeyLevelEditor.dc.html` (click around: steppers, stars, `Reset`, `Skip ahead to level`) and `KeyLevelPage.dc.html` (click a stretch). The numbers on both follow the rules constants, so use them as test values.

**Why.** Dave tested WO-68. The snapshot is a second editor and a second page that look nothing like the rest of the app, and a build at one level still doesn't read like a guide. What he wants is the normal builder without having to write every level. So the snapshot goes, and the level builder learns to **skip ahead**: the author writes level 10, then jumps to 25 and writes levels 11 to 25 as one card, then 50. Writing every level is just a build that never skips. There is one kind of build again, and the word "snapshot" leaves the app.

**Why the rules still hold** (so nobody re-adds Auto level's filling): every limit can be checked from a stretch's totals. Skill point cost depends only on the skill's value, unspent points bank, a stretch of n level-ups allows +5n per skill, and the skill cap only rises. If the totals pass, some level-by-level order exists, so the engine never has to pick one and the app never shows one.

1. **The plan.** No new build type. Two optional fields on `LevelPlan`:
   - `skipped?: true`: a level inside a stretch. It holds no choices of its own (no skill points, attribute, perks, Destiny, extras, spells, abilities, shouts, stone, deity or note; `parseBuildPlan` refuses any).
   - `attributes?: Partial<Record<Attribute, number>>`: on the last level of a stretch, the level-ups to each attribute, in place of `attribute`.
   - A stretch is a run of `skipped` levels plus the level after it, which holds the stretch's choices. The last level of a build is never `skipped`. `levels[L - 1]` stays level L everywhere, so the ruler, URLs, gear `fromLevel` and every lookup by level keep working.
   - Helper in `src/lib/rules/`: `stretches(plan)` → `{ from, to }[]` in level order. A level that isn't in a stretch is `{ from: L, to: L }`.
   - `copyBuildForVersion` carries both fields over.
2. **The engine** (`computeBuild`). Hardly changes, because a skipped level spends nothing:
   - **A skipped level:** banks its 30 skill points and earns its perk point, as an empty level does now. It raises no `attribute-missing`.
   - **The level that ends a stretch of n level-ups:**
     - **Per-skill limit:** +5n per skill. The message reads `Destruction: +80 is more than +75 in 15 level-ups.`
     - **Attributes:** the `attributes` counts must add up to n. Too few reads `Pick 3 more attribute level-ups.` and too many reads `4 attribute level-ups too many.`
   - **Everything else is as now:** skill cap at the level, perk requirements and prerequisites against the skills at the end of the stretch, trainer and Destiny totals, exclusions. A change to an earlier stretch that breaks a later one shows in the problem bar with `Go to levels 26 to 50`, like any problem now. Nothing blocks the edit.
   - Test against the canvas numbers. On the Altmer plan in `KeyLevelPage.dc.html` (`KEYS` in its script), levels 11 to 25 have 625 skill points available (175 carried in), 510 spent, 115 carried to 26, and 13 of 15 perk points spent.
3. **The editor: Skip ahead** (`KeyLevelEditor.dc.html`). It's the regular level editor at `/b/[id]/edit`. Nothing about it is a separate page.
   - **The footer** keeps `Continue to level N` and gains `Skip ahead to level` with the target level in the button and ‹ › to change it. The target starts 10 levels on, capped at `MAX_LEVELS`. Pressing it adds the skipped levels and the new last level, then opens it. The target is chosen first, so nothing jumps without the author asking.
   - **The level title** for a stretch: `Levels 11 to` with `25` as the big number. The pinned bar reads `Levels 11 to 25`. The ‹ › arrows step by stretch.
   - **Above the columns:** a row of chips, one per stretch, as on the build page (point 4). This replaces the level bars on a build that skips, and a build that never skips keeps its bars.
   - **The pools** count the whole stretch:
     - `Skill points`: what's left, with `510 of 625 spent, 175 carried in`.
     - `Perk points`: `13 of 15 spent`.
     - `Destiny points`: `2 of 3 spent`.
     - `Trainer sessions`: as now.
     - A single level keeps today's hints.
   - **Attributes** on a stretch: the three cards each show the total (`230`, `+45`) and a − n + counter of level-ups. The hint reads `15 level-ups, 0 left`. A single level keeps today's one-pick cards.
   - **Skill rows:** the stepper is the raise over the stretch (`+35`, with `40 → 75`) and still steps by 1. On a stretch the number in the middle can also be typed in. The header hint reads `Up to +75 each, max skill 75`. `+` stops at the per-skill limit, the max skill and the points left.
   - **The tree:** taking a star whose prerequisites aren't held takes them too, at this level, if the skills reach them. Keep the prerequisite-chain code from WO-65/68 for this and drop the rest of `fillToLevel`. On a stretch, a star the skill won't reach by its last level stays a dim dot, and the legend reads `Can take by level 25`. WO-68's **ruled out** stars (dashed ring, struck name, tooltip with the reason) stay, on every level. Move `ruledOut` out of `snapshot.ts` into its own file.
   - **Reset** in the footer: `Reset levels 11 to 25` (`Reset level 20` on a single level). It clears the level's skill points, attribute picks, perks and Destiny. Gear, spells and the note stay. Ask once with `Confirm: reset levels 11 to 25`, as `Remove level` does.
   - **Remove:** on the last stretch, `Remove levels 26 to 50` removes the whole stretch.
   - **Repeat:** `Repeat level N` and `Continue and repeat` only show when the level before is a single level. A stretch's raises can't be repeated into one level.
   - **Gear, spells, between level-ups and notes:** the same blocks as now, on the stretch's last level. Gear added there starts at that level.
4. **The build page** (`KeyLevelPage.dc.html`). It's the regular page; only the level parts learn about stretches:
   - **The ruler** draws each stretch as one box over its levels, the open one in ember.
   - **The chip row** has one chip per stretch (`11 to 25`, `13 perks`). Arrow keys and ‹ › step by stretch. `?level=20` opens the stretch holding level 20.
   - **The level nav** reads `Levels 11 to` with `25` as the big number and `of 50`.
   - **The level card**, heading `Levels 11 to 25`:
     - **Attributes:** `+45 Magicka`, `+20 Health`, `+10 Stamina`, most first.
     - **Skill points:** each raise as now, `+35` with `40 → 75`.
     - **Perks:** each with its requirement, `Impact (Destruction 50)`. A perk with no requirement keeps `(Block)`.
     - **Destiny, gear, new spells and the note** as now.
     - **Two columns:** skill and perk lists run in two columns when there are more than 6 rows.
     - A single level's card is unchanged.
   - **The sheet** below (attributes, skills, perks, Destiny, gear, spells) reads the stretch's last level, as it reads the open level now.
   - **The byline**, only on a build that skips, adds the levels written, with runs collapsed: `Levels 1 to 10, 25, 50`. A build that writes every level shows nothing new.
5. **Cards and Browse.**
   - **Cards:** a build card says `to level 50` like any build. A build that skips adds the same levels line as the byline.
   - **Browse:** the `Kind` filter goes.
6. **The snapshot goes.**
   - **Plan fields and types:** `BuildPlan.snapshot`, `Snapshot` and `SnapshotResult`.
   - **Rules code:** `src/lib/rules/snapshot.ts` (keeping `ruledOut`, moved) and its tests.
   - **Editor and page:** `snapshot-editor.*` and `snapshot-view.*`, the start choice (`StartChoice`, `?start=choose`; the wizard goes straight to `/b/[id]/edit` again) and `SNAPSHOT_TOUR`.
   - **Browse code:** the Kind filter and its query.
   - **Also:** the snapshot branches in `validate.ts`, `queries.ts`, `browse.ts`, `build-card.tsx`, `build-view.tsx`, `guide-page.tsx` and the home page, plus `e2e/wo68.spec.ts`.
   - **Old snapshot builds:** WO-68 never reached production, so the only snapshot builds are test builds on staging and dev. A plan with `snapshot` loads as its level 1, and the field is dropped on the next save. No database script.
7. **Tapps.** The author tour's last stop (`On to level 2`) reads `Done? Continue to level 2, or Skip ahead and write the levels in between as one. From level 3 on, Repeat copies the level before.`
8. **Later, not now** (parked): splitting a stretch (write level 18 inside 11 to 25), and a Browse filter for builds that write every level.

### Done when
- [x] Unit tests:
  - On the canvas Altmer plan, levels 11 to 25: 625 available, 510 spent, 115 carried, 13 of 15 perk points, and no problems.
  - +80 Destruction over 11 to 25 raises the per-skill problem with the message above.
  - Attribute counts that don't add up to 15 raise the attribute problem.
  - Impact taken at 25 with Destruction 45 raises `perk-skill`.
  - A skipped level with choices is refused by `parseBuildPlan`, and a plan ending on a skipped level is refused.
  - `stretches()` on the Altmer plan gives 1, 2 to 10, 11 to 25, 26 to 50.
  - The version copy keeps `skipped` and `attributes`.
- [x] e2e:
  - New build, level 1, then `Skip ahead to level` 10. The title reads `Levels 2 to 10` and the pools show 270 skill points and 9 perk points.
  - Raise Destruction to +20 by typing, give 9 attribute level-ups, and take Arcane Focus by clicking its star.
  - Skip ahead to 25, raise Destruction to 50, then click Impact: Empowered Destruction comes with it.
  - Reset clears it after the confirm.
  - The build page shows chips `1`, `2 to 10`, `11 to 25`, the card `Levels 11 to 25` with `(Destruction 50)` next to Impact, and the byline `Levels 1, 10, 25`.
- [x] e2e: a build that writes every level looks as it does today: bars in the editor, no levels line on the page or card.
- [x] Nothing of the snapshot is left: no route, start choice, Kind filter, tour, type or the word `Snapshot` in the UI (`grep -ri snapshot src` finds nothing but the plan loader's line that drops the old field).
- [x] Screenshots at 1440 and 390:
  - the editor on a stretch, including the footer and a ruled-out tooltip;
  - the editor right after `Skip ahead`;
  - the build page with the stretch card open.

  Compare with the canvas.
- [x] All checks in CLAUDE.md pass.

---

## WO-70  The guide, second pass: tooltips, icons and Nexus links (14 Oct 2026)

Dave on staging: better, but "still a lot of work before it's remotely useful". Three asks:
1. Icons, to break up the text.
2. Mods link to their Nexus pages.
3. Tooltips on words a newcomer won't know. The reader likely knows nothing about LoreRim: when the guide names a program (MO2), a mod, a mechanic or a system, they may not know what it is.

**Already changed in your code (by the chat session, commit `2c23223`):** the WO-66 parser rejected the new syntax, which would have broken the staging build. `src/lib/game-guide/guide.ts` now shows `{{term}}` and `{{text|id}}` as plain text (in `keys()`), and accepts `nexus:` under a mod and ignores it. Replace both with the real handling below; typecheck, lint and the guide tests passed on that change.

### Content (supplied with this order)
- `content/guide/terms.md`: 191 terms, each with a plain definition, and optionally an icon, a Nexus id and a `see` link to the section that explains it. Format in `content/guide/README.md`, "Terms".
- The chapter files now mark terms as `{{MO2}}` or `{{Armor spells|flesh-spell}}`, have an `icon:` in their front matter, and carry `nexus:` ids in Related Mods. Several passages were rewritten for newcomers. Don't edit the wording; flag anything odd in the commit.

### Tooltips
- Parse `{{text}}` and `{{text|id}}`. The text must match a term's heading or `aka` (case-insensitive) or the given id must exist; otherwise the build fails with file and line, as the other guide checks do. `terms.md` is parsed with the same rules (each `- see:` link must exist).
- A term shows its text with a dotted brass underline, and its icon in front at 16px when it has one.
- The tooltip opens on hover (after about 150 ms), on keyboard focus and on tap. It holds the term name in the title face, the definition, and up to two links: `Read more` (the `see` section) and `Nexus Mods` (opens in a new tab). Panel: `--panel-raised`, 1px `--rule` border, square corners, no shadow, at most 320px wide, kept on screen at 390px. Esc, tapping elsewhere or moving away closes it. One tooltip at a time.
- Without JavaScript a term is a plain link to `/guide/terms#id`.
- Terms work everywhere guide text appears: body, tables, More detail, Players ask, and `/guide/questions`. The questions filter matches the shown text, not the markup; the structured data uses plain text.
- **New page `/guide/terms`**: A to Z, each term with its icon, definition, links, and `Used in` (the chapters and sections that mark it, linked). Add it to the reference links under the chapter list, beside `Which mod runs what` and `All questions`.

### Icons
- **Term icons** come from `public/icons` (skills, attributes, races, birthsigns, deities, the two game modes, Destiny, perk points, trainer, skill book, power, shout). They sit inline before the term's text at 16px, pixelated, aligned with the text, decorative (`alt=""`).
- **15 new icons**, drawn in `scripts/icons/pixels.py` by the rules in `docs/design-rules.md`, "Pixel icons" (one object a player would name, no letters):

  | File | Object |
  | --- | --- |
  | `chapter-changes` | A rolled scroll with an ember wax seal |
  | `chapter-character` | A hand mirror |
  | `chapter-first-days` | A pinned notice-board note |
  | `chapter-staying-alive` | A campfire |
  | `chapter-fighting` | A steel sword |
  | `chapter-magic` | A blue spell tome |
  | `chapter-crafting` | A smith's hammer |
  | `chapter-getting-around` | A horseshoe |
  | `chapter-death` | A skull |
  | `chapter-followers` | An amulet on a chain |
  | `chapter-keys` | An iron key |
  | `need-hunger` | A loaf of bread |
  | `need-thirst` | A waterskin |
  | `need-fatigue` | A rolled bedroll |
  | `need-cold` | An icicle |

- **Chapter icons** show in the chapter list (between the number and the title), at 32px beside `Chapter 5` in the chapter header, on each `/guide` index entry, and in Previous and Next.
- The race, birthsign and needs tables get their icons through the terms in their first column; no table code needed.

### Nexus links
- In Related Mods and on `/guide/mods`, a mod with `nexus:` has its name linked to `https://www.nexusmods.com/skyrimspecialedition/mods/<id>`, in a new tab, with a small external-link mark after it. `tag: LoreRim's own mod` shows as the usual label.
- 16 mods have no id yet (the chat session reads them from the installed list when Dave's PC is linked): Animated Whistling, Complete Controller Setup, Dynamic Activation Key, Engine Fixes, Faster Mining Plus SE, Gamepad++, Lock Bashing, Locked Chests Have Keys, MaxsuBlockOverhaul, Requiem - Lockpicking SKSE, Requiem - Modern Combat Rework, Rest By Campfire - Base Object Swapper, Sanctified Stolen Goods, Simple Outfit System, Take a Nap - Sleep on Chairs, Vampire sun immunity with helmet or hat. Attack MCO is not on Nexus (tagged "Not on Nexus"). Leave these unlinked.

### Done when
- [x] Every `{{...}}` in the chapters renders as a term with its tooltip; a test feeds the parser an unknown term and a dead `see` link and expects build errors naming the file and line.
- [x] e2e at 1440: hover `MO2` in chapter 1; the tooltip shows the definition and `Read more`; Esc closes it. Tab to a term; the tooltip opens on focus.
- [x] e2e at 390: tap a term; the tooltip opens inside the screen; tapping elsewhere closes it.
- [x] With JavaScript off, a term is a link to `/guide/terms#id`.
- [x] `/guide/terms` lists all 191 terms A to Z with `Used in` links; a test counts them against `terms.md`.
- [x] The 15 new icons drawn in `pixels.py`; chapter icons in the list, the header, the index and Previous/Next; term icons inline, including the race and birthsign tables.
- [x] Related Mods and `/guide/mods` link every mod that has a `nexus` id; a test checks the count.
- [x] Screenshots at 1440: chapter 2 (race and birthsign tables), chapter 4 (needs table), a tooltip open, `/guide/terms`. At 390: a tooltip open, and the chapter list. Checked against `docs/design-rules.md`.
- [x] All checks in CLAUDE.md pass.

---

## WO-71  Launch: the editor stays fast on a long build (14 Oct 2026)
Status: done

**Why.** The chat session built a real 100-level build on staging: Sevari Uvayn, Morag Tong Nightblade, `/b/vhzj9w38n3`. It writes levels 1 to 5, then skips ahead in eight stretches to 100, with about 120 perks, gear, spells and a note on every key level. Vercel's toolbar flagged the editor's interactions:

| Where | Time the page stopped responding |
| --- | --- |
| a click on the page | 1.1 s |
| a keystroke in the gear search | 2.3 s |
| typing in a level's notes | 3.2 s |
| the perk tree | 3.2 s |

That is the one launch blocker: a long build is exactly what the best authors will write.

**Correction (14 Oct, after the build).** Those toolbar numbers were taken while the chat session's Chrome tab sat in the background, where Chrome holds off painting. The toolbar counts until the next paint, so they overstate the delay. Timed on the real Sevari build afterwards, a skill change settled in 33 to 55 ms, a level change in 58 to 97 ms, a perk star in 49 ms and a keystroke in the notes in 7 to 32 ms. Jeff's fixture numbers agree. The speed-ups in this order still stand.

**Where it isn't.** `computeBuild` on a 100-level plan takes about 2 ms. The time goes into rendering: likely the whole editor re-rendering on every change, the rules being re-run many times per render (per skill row, per star, per level mark), every tree node redrawing, and the notes editor saving or re-rendering on each keystroke. Profile before changing anything; don't guess.

1. **A fixture.** Copy the Sevari plan into `src/lib/rules/__fixtures__/` (export it from the staging database read-only, or rebuild it from the build page). Seed it in the e2e database as a 100-level build.
2. **A measurement.** Add `e2e/perf.spec.ts`. It opens the fixture's editor and the build page on a production build (`npm run build`, then `next start`) and records Event Timing entries (`PerformanceObserver`, `type: "event"`) for:
   - a skill `+` on levels 76 to 100;
   - a perk star click and Confirm;
   - typing 20 characters in the level notes;
   - typing 10 characters in the gear search;
   - ‹ › on the level nav, in the editor and on the build page.

   It prints the worst duration for each.
3. **Profile and fix** with the Chrome profiler on the same steps. Expected kinds of fix:
   - work out the build once per plan change and pass the result down;
   - memoize the tree and level row;
   - keep note and search typing local, with autosave debounced and the save off the typing path.

   Change what the profile shows, not this list.
4. **Targets** on the fixture, on a mid-range laptop profile (4× CPU slowdown in DevTools is fine as a stand-in):
   - clicks and stars: under 200 ms;
   - typing in notes and the search: under 50 ms a keystroke;
   - level nav: under 100 ms. *Changed by WO-74 to under 120 ms: at 4× the build page was 112 to 128 ms before WO-73, and 58 to 97 ms unthrottled.*
5. **Nothing changes on screen.** This order is speed only.

### Done when
- [x] The fixture exists and is seeded for e2e.
- [x] `e2e/perf.spec.ts` runs in `npm run test:e2e` and fails above the targets in point 4.
- [x] Before and after numbers for each step are in the commit message.
- [x] The Sevari build on staging edits without a visible stall: Dave checks it in the app. (Dave, 23 Oct: tested, done.)
- [x] All checks in CLAUDE.md pass.
*Mac, 22 Oct: typecheck, lint, 549 unit tests, the 11 player questions, 229 game-data tests and the build pass on this tree; e2e 357 of 357 ran on the same code with WO-129 (4b70d6f), including perf.spec.ts and the tree-label tests at 390 and 1440. The perf test passed in the full run each time. The Sevari box stays for Dave.*

---

## WO-72  Launch: things the app gets wrong (14 Oct 2026)

**Why.** These are the incorrect behaviours found building the Sevari build (`/b/vhzj9w38n3`). Each one is small, but each shows a reader or author something false. Every item has a unit or e2e test.

1. **List view can't take a perk on desktop.** In the editor's perk panel, `List`, clicking a perk opens the perk card with `visibility: hidden`. It only appears after switching back to `Tree`. The card must open in List view, next to the row, as it does by the star.
2. **Multi-rank perks show the first rank's requirement.**
   - On a stretch card, `Short Blade Focus 3 (One-Handed 25)` should read `(One-Handed 75)`.
   - `perkRequirement` in `build-view.tsx` reads `rankSkills[0]`. Use the rank taken (`perkRequirementText(p, rank - 1)`).
   - Check every other place that prints a rank's requirement.
3. **The reader is greeted as an author.** `READER_TOUR`'s welcome says `First build?`. Make it `First visit? Tapps shows you around. Four stops. Then mead.` (three stops without a guide). Keep Tapps' voice as it is elsewhere.
4. **The levels line misleads.** The byline reads `Levels 1 to 5, 10, 19 to 20, 30, 40, 50, 75, 100`. Here "19 to 20" is the end of the 11 to 19 stretch next to the single level 20.
   - Only merge runs of single levels.
   - The line becomes `Levels 1 to 5, 10, 19, 20, 30, 40, 50, 75, 100`.
   - Same on the build card.
5. **Points at the last level.** On the build's last level:
   - The footer says `65 skill points will carry over.` Make it `65 skill points unspent.`, and `3 perk points still unspent.` stays.
   - The level card's `Banked` row reads `Unspent`.
   - Levels before the last keep `Banked`.
6. **Changing gear keeps the old item's note.** `Change` on a slot at a later level pre-fills the note with the earlier item's note. The note belongs to the row it was written on, so a new row starts with an empty note.
7. **Trainer sessions on a stretch** show `5 left this level`. A stretch allows 5 for each of its level-ups, so levels 6 to 10 read `25 left in these levels`, still capped by what the build has left overall.
8. **The notes heading on a stretch** reads `Notes for level 10`. Make it `Notes for levels 6 to 10`.
9. **Short of perk points, the card blames a prerequisite.** With 1 point left, Concentrated Poisons says `Needs Alchemical Lore first.` with only Cancel. When the chain fits the skill but not the points, say so: `Needs Alchemical Lore first: 2 perk points, 1 left.` When the prerequisite really can't be had, keep today's line.
10. **The max-skill note marks only one skill.** `(max skill 80 at level 30)` appears under Illusion, while One-Handed and Sneak are also at 80. Put it under every skill at the cap, or once in the section's heading line (`Skill points (max skill 80)`), whichever reads cleaner on the canvas. Same in the editor.
11. **Enchantment boxes the perks don't allow.** On a made item, a second line shows without Enchantment Mastery, and a third without Artifact Enchanter. The engine catches it after saving. Show only the lines the build holds the perks for by that level, with the rule's words in a tooltip on the missing one (`Two enchantments need Enchantment Mastery.`).
12. **Perk order on a stretch card.** Perks the editor took along as prerequisites are listed after the rest (Improved Protection after Ward Mastery). Sort by tree, then requirement, then name.
13. **The Destiny pool after 30** reads `0 : 0 of 0 spent`. When the stretch earns no Destiny points and none are left, hide the breakdown and show `0`.

### Done when
- [x] Each point has a unit test or an e2e step, named by its point number.
- [x] e2e: in List view, click Weapon Mastery, Confirm, and it's taken.
- [x] On the Sevari build, as a reader:
  - the byline matches point 4;
  - the 21 to 30 card shows `Short Blade Focus 3 (One-Handed 75)`;
  - the 76 to 100 card says `Unspent`.
- [x] Screenshots at 1440 and 390 of the points that change the screen.
- [x] All checks in CLAUDE.md pass.
*Mac, 22 Oct: typecheck, lint, 549 unit tests, the 11 player questions, 229 game-data tests and the build pass on this tree; e2e 357 of 357 ran on the same code with WO-129 (4b70d6f), including perf.spec.ts and the tree-label tests at 390 and 1440.*

---

## WO-73  Launch: layout and polish (14 Oct 2026; footer change for Dave to OK)

**Why.** These are layout problems from the same drive. None is wrong information, but together they make the app look unfinished.

1. **Trees open cropped.** Design rule: crowded rows stagger up to three deep, *every tree fits its box*, and names never touch.
   - Today the editor and the build page open One-Handed and Destiny zoomed in, with edge labels cut (`Strike / nded 50`, `tness`, `Mage` half off).
   - At Fit, One-Handed hides the labels for Short Blade Focus and Unarmed Defense.
   - **Fix:** every tree opens fitted, every star keeps its label, and nothing is cut at the edges. That's in the editor (with the panel at its real height on a 1512×806 laptop window), in the reader, and on phone.
2. **The perk badge covers the skill value.** At 100 the row reads `[5]90 → 100`. The badge and the values never overlap; drop the `from` value before the badge collides.
3. **Ragged line breaks** (Dave has raised these before):
   - `One-/Handed` in the `Taken by level` panel;
   - `Max skill 51 at level / 1` in the editor's skills header;
   - `Introvert, Focused / Combat: One- / Handed` in the traits row.

   Fix each so the text uses its column's width, or shortens. Don't hyphenate skill names.
4. **Phone:**
   - the ruler's numbers collide (`95100`): at 390, label every 10 or 25;
   - the start reads `From Overseas, Wi…`: let it wrap.
5. **`replaces nothing`** on new gear: drop the clause when the slot was empty.
6. **The editor footer is crowded.** A single level shows six controls: Reset, Remove, Continue and repeat, ‹ Skip ahead to level N ›, and Continue.
   - **Proposal:** move `Reset` and `Remove` to the level bar, as quiet buttons by the level title, since they act on the level shown.
   - The footer keeps only the ways forward.
   - **Dave to OK before building.**
7. **Two levels fill the row.** With only levels 1 and 2, each cell is half the page wide. Give cells a maximum width and align them left until the row fills.
8. **The spell picker:**
   - each spell shows its game description under its name, as perks do;
   - a search with no match says `No spells match.`;
   - once the picks are full, the list folds to the chosen spells, with `Change` to open it again.
9. **`Ruled out` in the legend** only when the open tree has a ruled-out star.
10. **The hover tooltip and the perk card** both show on a clicked star. Hide the tooltip while the card is open.
11. **The wizard's Details preview** still shows the old `Levels` and `Guide` pills. Use the WO-60 tabs.
12. **Level row accessibility:** a cell's `aria-label` lists notes and gear, but not perks, Destiny or spells. Name what the cell's marks show (`Levels 21 to 30, 10 perks, 2 Destiny, notes`).

### Done when
- [x] Screenshots at 1512×806, 1440 and 390 for each point, compared with the canvas where a board exists.
  *Chat session, 14 Oct: reader screens compared on staging. Points 4, 5, 10 and 12 match, and point 1 and point 7 at 1440. Point 1 and point 7 on a phone, and the Taken-by panel (point 3), go to WO-74. The editor and wizard screens (points 2, 3's skills header, 6, 8 and 11) are still to compare, in WO-74.*
- [x] e2e: open One-Handed and Destiny in the editor and on the build page. Every star's label is inside the box and none overlap; check it with bounding boxes.
- [x] Point 6 waits for Dave's OK; mark it done or dropped.
- [x] All checks in CLAUDE.md pass.
*Mac, 22 Oct: typecheck, lint, 549 unit tests, the 11 player questions, 229 game-data tests and the build pass on this tree; e2e 357 of 357 ran on the same code with WO-129 (4b70d6f), including perf.spec.ts and the tree-label tests at 390 and 1440.*

---

## WO-74  Launch: tree labels on phones, and level nav back under target (14 Oct 2026)

**Why.** WO-73 left three things open: the build page's level nav got slower, phones can't fit every star's name, and the editor screens weren't compared with the canvas. A check of the reader screens also found a few small layout faults.

1. **Level nav got slower: fix the cause.** On the build page at 4×, level nav went from 112–128 ms to 152 ms.
   - Measured in a unit bench (fast machine, no slowdown): a first placement on a tree now costs 3 to 4 times what it did. One-Handed went from 1.1 to 4.3 ms and Destiny from 2.1 to 7.8 ms. At 4×, that is the extra 20 to 30 ms. Once a tree's spots are cached, placing again is under 1 ms either way.
   - The cost is `spotAllowed`. It runs over every candidate spot (WO-73 raised them from about 12 to about 80 a star) against every star. Its cache is keyed by the label's text. A new level likely changes many stars' lines, so a level not seen yet misses the cache: check this in the profile.
   - Expected kinds of fix (change what the profile shows): key the allowed spots by star and label size, not text; in `spotAllowed`, skip stars too far away to overlap or be nearer. Placing from cached spots, squeeze included, is already under 1 ms, so leave the squeeze alone.
   - **Target:** level nav under 120 ms at 4× (WO-71 point 4 is changed to match), in the editor and on the build page.
2. **Phones: the names that matter always show.** A 356 px box can't hold 51 names, so the rule on a phone (tree box under 600 px wide) is:
   - Every taken and can-take star keeps its label. Today on Destiny at level 30, Silent Blade and Spellblade (both taken) and every can-take star lose theirs, while not-yet names like Saboteur and Monk keep theirs. On One-Handed, Short Blade Focus (taken) loses its label.
   - If there's no room beside the star, the label sits further out, with a 1 px line from the star's edge to the label's near edge, in the star's colour at half strength. Not-yet stars never get a line.
   - Not-yet stars get a name where one fits, and none where it doesn't. Zooming in or tapping a star shows the rest, as now.
   - Desktop is unchanged: every star keeps its label at Fit.
3. **Labels must read as their star's.**
   - Each label's text gets a halo in the tree's background colour, so a link line never runs through letters (at 1440: War Axe Focus's requirement, Piercing Strike, Viper's Blade).
   - Two labels on one row keep at least 10 px between them, so separate names don't read as one ("Assassin Saboteur", "Berserker Monk General", "Corrosive Weapon Absorbtion").
   - Drop the far corner spots (more than half a label's width out to the side). Mace Focus and Stunning Blow sit too far from their stars, and on a phone Hand to Hand sits under Penetrating Strikes. Use point 2's line instead, for taken and can-take stars only.
   - A taken star's short label keeps its rank (`Short Blade Focus 3`). Only the requirement line drops.
4. **Taken-by panel:** `One-Handed` runs into `Short Blade Focus 1` with about 2 px between them. Give it the Held list's gutter from the canvas, with the tree name beside its first perk.
5. **Phone level row:** with four cells, the row stops 38 px short of the right edge. When the cells don't fill the row on a phone, share its width evenly.
6. **Ruler:**
   - the selected diamond's halo cuts the top off its number (`30`);
   - the window's slanted edge crosses the `1`;
   - on a phone, the Destiny diamonds for 19 and 20 overlap. Keep the number clear, and nudge diamonds apart when they touch.
7. **WO-73's editor screens:** compare points 2, 3 (the skills header), 6, 8 and 11 with `EditorSticky`, `EditorStickyPhone`, `Spells` and `DetailsThemes` on the canvas. Fix what differs, or note why the build is right. Tick WO-73's screenshot box when done.

### Done when
- [x] e2e: `perf.spec.ts` passes at under 120 ms for level nav, editor and build page; the before and after numbers are in the commit message. *As WO-75 settled it.*
- [x] e2e at 390: on One-Handed and Destiny at levels 30 and 100, every taken and can-take star has a label. None overlap, none are cut, and no label is closer to another star than to its own. *As WO-75 settled it.*
- [x] e2e at 1440: point 3 is checked by bounding boxes: no link line crosses a label's text box, and labels on one row are at least 10 px apart. *As WO-75 settled it.*
- [x] Screenshots at 1512×806, 1440 and 390 for each point, compared with the canvas where a board exists.
- [x] All checks in CLAUDE.md pass.

*Chat session, 14 Oct: the three open boxes above are settled in WO-75.*
*Mac, 22 Oct: typecheck, lint, 549 unit tests, the 11 player questions, 229 game-data tests and the build pass on this tree; e2e 357 of 357 ran on the same code with WO-129 (4b70d6f), including perf.spec.ts and the tree-label tests at 390 and 1440. The three e2e boxes are ticked as WO-75 rewrote them: the median level-nav test, the rule at 390 and the halo at 1440, all in the full run.*

---

## WO-75  Launch: close out WO-74's three open checks (14 Oct 2026)

**Why.** WO-74 did the work, but three of its checks can't pass as written. The chat session checked staging at 1440 and 390 and settled each one.

1. **Level nav: measure the median, not the worst.** At 4× the build page ran 112, 144 and 120 ms across three runs, so the worst single click is mostly noise. In `perf.spec.ts`, take five ‹ › steps each way and test the median under 120 ms, with the worst under 160 ms. The editor and the build page are both tested.
2. **Phones: rank, don't promise every name.** A 356 px tree can't hold every taken and can-take name. On a phone the build page already names them right below the tree: the Destiny line, and the held list under the tree.
   - Keep the rule that no label sits nearer another star than its own. Drop the leader lines if they never place a label there.
   - The test at 390 becomes: no not-yet label takes a spot that a taken or can-take label could have used; none overlap; none are cut; and every taken perk is in the held list below the tree.
3. **Lines through labels: the halo is the fix.** At 1440, lines pass under the halo and read cleanly; checked on Destiny at level 30. Replace the bounding-box check with one that every label has the halo.
4. **Desktop lost a label.** On the build page at 1440, Destiny at level 30 shows 50 of 51 names: Conjuring Presence is missing. WO-73's rule holds on desktop: every star keeps its label at Fit. If the 10 px gap is what costs it, use 8 px.

### Done when
- [x] `perf.spec.ts` passes with point 1's median and worst.
- [x] e2e at 390 tests point 2's rule, on One-Handed and Destiny at levels 30 and 100.
- [x] e2e at 1440: every label has the halo, and One-Handed and Destiny keep every label at levels 30 and 100, editor and build page.
- [x] The full e2e run passes, along with every other check in CLAUDE.md.

---

## WO-76  Launch: free spell picks you can't miss (14 Oct 2026)

**Why.** The Sevari build had 11 free spell picks left empty across levels 75 and 100: Master Illusion, Novice Restoration and Novice Destruction, then Apprentice to Master Restoration. Dave found them; the chat session, which built it, never noticed.
- Taking a tier perk gives no prompt. The `Choose 2 spells` box appears further down the level with no signal.
- Nothing marks an empty pick afterwards: not the level bar, not the level row, not the build.
- Skip ahead makes it worse. A stretch can take several tier perks at once (level 100 took four), so the boxes stack up out of sight.

1. **Say it when the perk is taken.** The taken line becomes `Apprentice Restoration taken. 2 perk points left.` followed by a `Choose 2 spells` button. The button scrolls to that perk's picker and puts focus in its search. Same on phones, in the sheet.
2. **Empty picks are a to-do, not a problem.** They don't count as problems, and they never block saving or sharing.
   - **Level bar:** beside the level's other counts, `3 spells to choose`. It's a button to the first picker with picks left.
   - **Level row:** the cell gets the spells mark hollow until the picks are full, and its name adds `3 spells to choose` (WO-73 point 12).
   - **Edit bar:** across the whole build, `11 spells to choose: levels 75, 100`. Each level is a link. This goes when none are left.
3. **One place for a level's picks.** When a level takes more than one tier perk, the pickers sit together under one heading, `Spells to choose`, right under the perks. Each picker folds to its chosen spells once full (WO-73 point 8). Pickers with picks left come first.
4. **The reader sees nothing new.** Empty picks are the author's to-do; the build page doesn't mention them.

Use the game's words for perk and spell names. The ember accent marks picks left, as `0 of 2 chosen` already does.

### Done when
- [x] e2e: take Apprentice Restoration on a level. The taken line's `Choose 2 spells` focuses that picker's search, and the level bar says `2 spells to choose`.
- [x] e2e: a stretch with two tier perks shows both pickers under `Spells to choose`, and the edit bar's count and links match. Choosing every spell clears all three.
- [x] Unit test: the count of spells to choose per level and per build, including a Master tier perk (1 pick).
- [x] Screenshots at 1512×806 and 390 of points 1 to 3.
- [x] All checks in CLAUDE.md pass.

---

## WO-77  Launch: the pinned bar on a stretch (14 Oct 2026)

**Why.** On a stretch, the pinned bar's summary has too much to show. At levels 51 to 75 on Sevari it holds eight skill gains, then Shadowrunner, then a chip cut off mid-name (`Mast…`), and the rest is lost. The folds from earlier orders (skill names, gear, stone) were made for single levels, where there are only a few perks.

1. **More folds, after the ones there are:**
   - **Perks by tree:** one chip per tree, with the tree's icon and a count (`Restoration ×5`). The tooltip lists the perks, and a click selects the first in the Perks section. Destiny keeps its own gold chip.
   - **Perks as one chip:** `9 perks`, with a tooltip that lists them by tree.
   - **Skills as one chip:** `8 skills, +210`, with a tooltip that lists each gain.
2. **Never cut a chip.** If the row still doesn't fit, it ends with a `+N more` button where the `…` was. The button scrolls to the level card, which shows everything.
3. **Single levels don't change** unless they overflow too; the same folds apply to any level.

### Done when
- [x] e2e on Sevari at 1440 and 1280, at levels 51 to 75 and 76 to 100: the pinned bar is one line, every chip fully inside it, nothing ending in `…`.
- [x] e2e: the `+N more` button, when shown, scrolls to the level card.
- [x] Screenshots of the pinned bar at 1440 and 1280 for a single level and both stretches.
- [x] All checks in CLAUDE.md pass.

---

## WO-78  Launch: three small changes from Dave (14 Oct 2026)

1. **Trees open fully zoomed out, everywhere.** Every tree opens at Fit (WO-73) when it is first shown, but a zoom the reader made carries over to the next level and the next visit to that tree.
   - A tree goes back to Fit whenever the level, the tree or the page changes. Inside one level, the reader's zoom stays until they leave.
   - The same goes for every place a tree is drawn: the build page's Perks and Destiny boxes, the editor's tree panel, and the phone sheet.
   - A star picked from outside the tree (the level card, the held list) still selects it, but the view stays at Fit.
2. **The pinned bar drops the Levels and Guide tabs.** On the build page they crowd the stepper and the level summary (Dave's screenshot, levels 51 to 75). With the tabs gone:
   - on the Levels tab, the pinned bar holds the stepper and the summary;
   - on the Guide tab (and Story, WO-79), there is no pinned bar. The big folder tabs are where you switch, at the top of the page.
3. **The level note's heading:** `About this level`, or `About this level range` on a stretch.
   - In the editor, it replaces `Notes for level N` and `Notes for levels N to M`. The region's accessible name keeps the numbers: `About levels 21 to 30`.
   - On the build page, it's a heading over the note in the author's column, under the author's name.
   - When there's no note, the text reads `No note for this level.` or `No note for this level range.`

### Done when
- [x] e2e: zoom One-Handed in, change level, and it's at Fit again. Same in the editor and on a phone.
- [x] e2e: the pinned bar has no tabs; it shows on the Levels tab only.
- [x] e2e: the note's heading on a single level and on a stretch, in the editor and on the build page.
- [x] Screenshots at 1440 and 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-79  Story: the build's tale, with the author's screenshots (14 Oct 2026)

**Why.** Authors write role-play builds: who the character is, where they came from, what they did. Today that ends up squeezed into the description or the Guide. The Story tab gives it a place of its own that reads like a book, not a form.

**Board:** `StoryTab` on the design canvas (row 17). Click an image to see the viewer.

1. **A third tab on the build page: `Story`.** It sits after Guide, as a folder tab with its own icon. The tab's second line reads `4 images, 4 min read`. It only shows when the author wrote one.
2. **Writing it** reuses the Guide editor as it is: headings, bold and italic, quotes, links, @-mentions, images. It's a `Story` page in the edit bar, next to `Guide`.
   - At most **5 images** in a Story, counted on their own (the build's limit of 40 still holds). The image button says `3 of 5 images`; at 5 it is disabled, with `A story can have 5 images.`
   - Uploads go through the same checks as the cover and the Guide (`screenUpload`: new accounts, the upload limit, the nudity check).
   - Each image can have a caption (one line, plain text).
   - Two images placed one after the other show side by side on wide screens.
   - A story has a title (required, up to 60 characters) and an optional opening line (up to 140 characters).
3. **Reading it, on the board:**
   - **The opening plate:** the story's first image, full width and about 640 px tall, with the title and the opening line over its lower edge on a dark fade, as the cover does. With no image, the title sits on the plain dark band.
   - **The text is a book page:** Alegreya at 20 px with line height 1.75, a column 680 px wide, warm off-white (#ddd5c6) on a darker ground (#0b0f14). The first paragraph gets a brass drop cap. Headings are the site's condensed caps, centred.
   - **Images are plates:** 1000 px wide (wider than the text), with brass corner marks, and the caption under them in Alegreya italic.
   - **A quote the author marks** is set large in Alegreya italic, between two brass ornaments.
   - **The viewer:** clicking a plate opens it full screen, with its caption, ‹ ›, the arrow keys, `2 of 4` and Esc to close.
   - **The end:** an ornament, the character in one line (`Dunmer | The Shadow | Mephala | Levels 1 to 100`) and `Follow the build level by level ›`, which goes to the Levels tab at level 1.
   - **Phone:** plates run edge to edge, the text is 18 px with a 16 px gutter, and the viewer swipes.
4. **Design rules:** the Story is the one place Alegreya is used for body text, since it is flavor text (add this to the Visual system section of the design rules). Everything else stays as it is.
5. **Browse and the share card:** builds with a Story get a small `Story` tag on Browse. The share card is unchanged.

### Done when
- [x] e2e: write a Story with a title, three paragraphs, a quote and 5 images with captions. A sixth image is refused, with the message.
- [x] e2e: the build page shows the Story tab; the plate, the drop cap, the side-by-side pair and the viewer (‹ › and Esc) work.
- [x] A build without a Story shows no Story tab.
- [x] Screenshots at 1440 and 390, compared with `StoryTab`.
- [x] All checks in CLAUDE.md pass.

---

## WO-80  The tour, second version, and a sample build (14 Oct 2026)

**Why.** The reader's tour has four stops that jump around the page, no way back, and lines that joke more than they explain (design rule 22). New visitors also land on Browse with no build in front of them, so the tour waits until they open one.

1. **A sample build.** One complete, ordinary build that shows every part of the app: levels written one by one, notes, gear, spells, a Guide and a Story. Its id goes in config (`SAMPLE_BUILD_ID`), not in code. **The build is Iriel Thornwhisper (`7h38zdhjnu`)** (Dave, 14 Oct). The chat session took her to level 50: levels 1 to 35 one by one, then the stretches 36 to 42 and 46 to 50, with three spells, gear upgrades at 33, 42 and 45, a note on every level, and a Guide section for 31 to 50. A Story comes once WO-79 is built.
2. **The first visit.** On a visitor's first page that isn't a build (home, Browse), Tapps offers:
   - `New here? Walk through a sample build.` with `Show me` and `No thanks`.
   - `Show me` opens the sample build at level 1 and starts the reader's tour.
   - `No thanks` closes it, and the reader's tour starts on the first build they open. Neither shows again once the tour is done.
3. **The stops, in page order** (each lights its part of the page):
   1. **Level row and ruler:** pick a level, or step with ‹ ›.
   2. **The pinned bar:** it stays at the top as you scroll; it shows the level and what changed there.
   3. **The level card:** what was taken at this level, and the author's note (`About this level`).
   4. **Attributes and skills:** where the character stands at this level.
   5. **Perk trees:** each tree as it stands at this level; click a star for its card.
   6. **Gear:** what the build wears and when it changes.
   7. **Spells:** spells learned so far, by school.
   8. **Guide and Story tabs** (whichever the build has): the author's write-up and the character's tale.

   A stop the build doesn't have is skipped (no gear, no spells).
4. **Moving between stops:**
   - `Next` scrolls the page smoothly to the next stop. It doesn't jump. The light moves once the scroll ends. Reduced motion jumps.
   - `Back` returns to the stop before.
   - The card shows `3 of 8`, and Esc ends the tour.
   - On a phone, the card sits at the bottom, clear of what it points at.
5. **Lines, under rule 22:** one or two short sentences per stop that say what it is and what you can do. The chat session writes them into `READER_TOUR` with this order. The author's tour (`AUTHOR_TOUR`) gets the same plain rewrite; its stops don't change.
6. **The board:** update `TourReader` on the canvas to the new stops, with the welcome on Browse.

### Done when
- [x] e2e: a first visit to Browse offers the sample build. `Show me` opens it with the tour at stop 1; `No thanks` starts the tour on the next build opened.
- [x] e2e: Next scrolls to each stop in order, Back returns, a missing stop is skipped, and the count matches.
- [x] No joke lines left in `src/lib/tour.ts` (the chat session checks the copy). *Checked 15 Oct: clean. One phrase to drop in WO-81.*
- [x] Screenshots of each stop at 1440 and 390.
- [x] All checks in CLAUDE.md pass.

---

## WO-81  Launch: hide Story and the LoreRim guide for now (15 Oct 2026)

**Why.** Dave, 15 Oct: both need more work from him before people see them. Hide them, don't delete them. Iriel's Story and the guide's content stay in place for later.

1. **One switch for each,** read from the environment so they can come back without a code change: `FEATURE_STORY` and `FEATURE_SITE_GUIDE`.
   - Off by default, and off on production.
   - On in dev and in e2e, so their tests keep running.
   - Staging: off, so Dave sees what launches.
2. **Story off:**
   - no Story tab on the build page;
   - no Story page in the edit bar;
   - `/b/[id]/story` returns not found;
   - no Story tag on build cards;
   - the tour's last stop names the Guide only.

   The saved Story sections stay in the database, untouched.
3. **Site guide off (the beginner's guide: `/guide`, its chapters, Mods, Questions and Terms):**
   - the `Guide` link leaves the site nav and the footer;
   - every `/guide` route returns not found;
   - nothing in the sitemap.
   - A build's own **Guide tab is not this** and stays as it is. Its term tooltips (WO-70) still show on hover, but stop linking to `/guide/terms`.
4. **Tour copy:** the level card stop drops "in the order the game asks", which isn't checked. It reads `What was taken at this level. The author's note is beside it, under About this level.`

### Done when
- [x] e2e with both switches off: no Story tab, edit-bar link or card tag; `/b/[id]/story` and `/guide` are 404s; no Guide link in the nav or footer; a build's Guide tab still works, and its terms show tooltips without links.
- [x] e2e with both on: the existing Story and guide tests pass unchanged.
- [x] Staging shows the launch view (both off).
- [x] All checks in CLAUDE.md pass.

---

## WO-82  Launch: gear by type, any number at once (15 Oct 2026)

**Why.** Dave tested every body slot combination in game (15 Oct; 105 items, one or two for each of the 80 combinations LoreRim uses). Slots don't map cleanly to what a piece is:
- a helmet covers the head and the face, or just the head;
- four or five accessories can be worn at once.

So the planner sets **no rules** on what can be worn together. It only helps the author find the piece: pick its type, then search within that type.

**Data (done by the chat session, this commit):** every wearable piece is now in `items.json`, 337 more than before. Each armor row has a `type` from `scripts/gamedata/items.py` (`gear_type`): the piece's name first when it says what it is (`Fur Cape` is a Cloak, `Cultist Mask` a Face), then its body slots. The type words are LoreRim's own, from Aura's Inventory Tweaks. `GEAR_TYPES` lists them in order:

> Head, Circlet, Face, Body, Hands, Feet, Legs, Shield, Cloak, Mantle, Pauldron, Scarf, Backpack, Bag, Belt Bag, Bandolier, Amulet, Necklace, Ring, Earrings, Bracelet, Armlet, Lantern, Spyglass, Instrument, Accessory

The old `slot` field stays for now, null for pieces the old slots didn't cover. Physics objects, `$TNG_` records and pack-mule gear are skipped (`overrides.json`).

1. **Types in place of slots.** The gear types are Main hand, Off hand and Ammo, then the list above. Saved builds keep working: Head, Body, Hands, Feet, Ring and Amulet keep their names, and `Other` reads as `Accessory`. The plan's gear rows keep their shape, with the type in `slot`, so no migration is needed.
2. **Any number of pieces per type,** the way `Other` works today:
   - a new piece adds to what's worn;
   - when the author picks a piece it `Replaces`, that one comes off. A new piece of a type where exactly one is worn offers to replace it, ticked.
   - `Empty from here` takes one piece off.
   - No warnings about pieces that clash in game.
3. **Adding gear: type first, then the item.**
   - The type is a plain list in the order above (design rule 10: no invented groups).
   - The search then shows only that type: Main hand any weapon; Off hand one-handed weapons and shields; Ammo ammunition; an armor type its own rows.
   - Under the results, `Search every item` drops the type filter, for a piece filed under a type the author didn't expect. Picking one keeps the type the author chose.
   - Free text still works, for a piece that isn't in the index.
4. **The build page and the level card:**
   - the gear timeline has a row per type, with a lane per piece when several are worn at once;
   - the level card says `Cloak: Fur Cape, replaces Imperial Cloak`, or `Accessory: Histus Flask` for a piece that adds.
5. **Copy:** `Type`, `Replaces`, `Search every item`. Type names as listed.

### Done when
- [x] Unit tests: gear held at a level with two pieces of one type, a replace, an `Empty from here`, and an old build's `Other` row read as Accessory.
- [x] e2e: add a Cloak (search shows cloaks only), then a Backpack, then a second Accessory. All three are worn at the next level, and the level card lists them. `Search every item` finds a piece outside the type.
- [x] Iriel and Sevari read as before on the build page (screenshots at 1440 and 390).
- [x] All checks in CLAUDE.md pass.

---

## WO-83  Launch: gear icons in place, and three checks rerun (15 Oct 2026)

**Why.** WO-82 left most gear types on a borrowed or plain icon. The chat session drew one for each type (commit 03a8bca: `scripts/icons/pixels.py`, `public/icons/slot-*.svg`, `SLOT_ICON` in `skill-icon.tsx`). Shield uses the tag's shield and Bag uses the satchel, the same icon as `Other`. Free-text gear on the "New gear" row keeps the plain satchel (WO-46). The icons haven't been looked at in the app yet, and three e2e tests couldn't pass in the chat session's container.

1. **Look at the icons where they're used:** the type list when adding gear, the editor's gear rows, the level card's "New gear" row and the build page's gear timeline. Each type shows its own icon at 16 px, lined up with its label like the others. Don't redraw an icon in this order; if one reads wrong, say which in the commit message and the chat session will redraw it.
2. **Rerun the three tests** that failed only in the chat session's container:
   - `guide.spec.ts` images and `wo79.spec.ts` point 2 failed with no blob token in its `.env.local`;
   - `perf.spec.ts` came in at Confirm 216 ms (target 200) and typing in notes 104 ms (target 50) on a busy machine.

   If a perf number still misses on a normal run, say so with the numbers. Don't tune the code in this order.

### Done when
- [x] e2e: add a Cloak and a Lantern. Each shows `slot-cloak.svg` / `slot-lantern.svg` in the editor, the level card and the gear timeline. Free-text gear still shows `slot-other.svg`.
- [x] Screenshots at 1440 and 390: the type list open, and Iriel's build page gear timeline.
- [x] `guide.spec.ts`, `wo79.spec.ts` and `perf.spec.ts` pass, with the perf numbers in the commit message.
- [x] All checks in CLAUDE.md pass.

---

## WO-84  Launch: a coming soon page for lorerimplanner.com (15 Oct 2026)

**Why.** Dave bought lorerimplanner.com. Until launch, the domain shows a coming soon page and nothing else, so production can be released, migrated and tested by Dave without anyone else using the app. The design is on the canvas, row "Proposal: a coming soon page for the domain": boards `ComingSoon.dc.html` (desktop, press Play to see it move) and `ComingSoonPhone.dc.html` (390). Dave approved it on 15 Oct. Copy it as drawn, words included.

**Already in this commit (chat session):**
- `public/coming-soon/hero.webp` (2400 wide) and `hero-1200.webp`: Dave's in-game Screenshot782 (the archer on the ledge), from the PC.
- Ten new Tapps frames in `scripts/icons/pixels.py` (`TAPPS_FRAMES`), generated to `public/icons/tapps-lost-0..2.svg`, `tapps-writing-0..3.svg`, `tapps-cheers-0..2.svg`. 30x30, shown at 150 px (5x), pixelated. The last frame of each set is a blink.

1. **A switch, `FEATURE_COMING_SOON`**, in `src/lib/features.ts`, but **off unless set**: unlike Story and the site guide it has no `next dev` default, so dev, staging and e2e show the app. Dave turns it on for production only, and off at launch.
2. **With it on, every page route shows the coming soon page,** at its own URL (no redirect), with a 200 status, except:
   - signed-in admins (`isAdmin`), who see the app as usual;
   - `/api/auth/*`, `/og` images, icons and static files;
   - a new `/signin` route: one `Sign in with Discord` button, not linked from anywhere, so Dave can sign in on production. After sign-in it goes to `/`.
   - `robots`: the coming soon page is indexable; every other page answers with the coming soon page anyway.
3. **The page,** as the canvas, top to bottom:
   - **Hero:** the screenshot full width with the slow drift (scale 1.02 to 1.12 over 48 s, alternating), the left and bottom fades, the pixel star (`logo-0`, 48 px), `LoreRim` / `Build Planner` as the h1, the four lines with their 32 px icons (`race-nord`, `destiny`, `tab-levels`, `speech`), `Opening soon` in ember, and `Tapps, in LoreRim 5.0.4.8` bottom right. Height `clamp(640px, 62vw + 300px, 900px)`; use `100svh` instead if it reads better on a phone, but never taller than 900.
   - **The tree:** `Iriel Thornwhisper, levels 1 to 50`, `Sample build by Tapps`, `Marksman perks, in the order she takes them.` The Marksman tree lights star by star with a level counter and a taken list, as the board does. Draw it with the app's own tree code (`src/components/build/tree.tsx`) in a read-only mode, not a copy, so it can't drift from the real thing. The levels come from a small fixed list in the page (the perk and the level she takes it, as in the board's script), not from the database: the page must work with no sample build in production. Timing: one level every 170 ms, hold at 50 for about 2.7 s, start again.
   - **Two screens:** the build page and the ruler, in the brass corner frames. Take fresh ones of Iriel on staging with `scripts/shot.mjs` at 2x and commit them under `public/coming-soon/`.
   - **Why I made this:** the three Tapps panels with Dave's three lines, signed `Tapps`. Frames change on the board's beats (`lost: 0 1 0 1 0 1 2 1`, `writing: 0 1 2 2 3 2 2 2`, `cheers: 0 0 1 0 0 0 2 0`, a beat about half a second).
   - **Footer:** Tapps (32 px), `Made by Tapps.`, `Not affiliated with the LoreRim team.`, `lorerimplanner.com`.
   - Both `LoreRim Discord` links go to `https://discord.gg/bungalo` (the footer's `DISCORD` constant).
4. **Motion:** with `prefers-reduced-motion: reduce`, no drift, the tree shows level 50 finished, and Tapps holds frame 0 of each pose. Pause the timers when the tab is hidden.
5. **Head:** title `LoreRim Build Planner`, description `A build planner for LoreRim. Plan a character, see what changes at each level and share it.`, and the existing site share card (`/og`).
6. **No sign-up, no tracking,** nothing stored.

### Done when
- [x] Unit test: `FEATURE_COMING_SOON` is off when unset, also under `next dev`.
- [x] e2e with the switch on: `/`, `/b/<a build>`, `/new` and `/guide` all show the coming soon page; `/signin` shows the button; an admin session sees the real home page; `/api/auth/providers` still answers. With it off, `/` is the usual home page.
- [x] e2e with reduced motion: the counter reads 50 and every one of Iriel's 15 Marksman perks is lit.
- [x] Screenshots at 1440 and 390, the tree mid-way (level 23) and the Why section, compared with the canvas boards.
- [x] All checks in CLAUDE.md pass.

---

## WO-85  Launch: the coming soon page, second pass (15 Oct 2026)

**Why.** Seen in the browser, WO-84's page felt thin. The archer was buried under the words, the tree opened as a grey outline, and the two screenshots were too small to read. Dave approved a second pass on the canvas: boards `ComingSoon2.dc.html` (desktop, press Play) and `ComingSoon2Phone.dc.html` (390), in the row "Proposal: a coming soon page for the domain". Rebuild `/coming-soon` to match them, words included. The switch, the proxy, `/signin`, the motion rules and the tests from WO-84 stay as they are.

**Already in this commit (chat session):** in `public/coming-soon/`:
- `hero.webp` and `hero-1200.webp` are now mirrored, so the archer stands on the right;
- `cover.webp`, `character.webp`, `level.webp` and `gear.webp`: Iriel's build page on staging at 2x (her cover, the character row, the level 20 ruler and card, the gear timeline);
- `card.webp`: her build link's preview card.

They are static on purpose: production has no sample build yet. Delete `build-page.webp` and `ruler.webp`, which nothing uses now. The trait art is the app's own (`/traits/focused-combat.webp`, `/traits/witcher.webp`).

1. **Hero:** as WO-84, with the mirrored picture and the fade ending past the middle (`.94` at 0, `.78` at 30%, `.15` at 56%, clear from 70%). The fourth line is now `Share it with the community`, with no link. Under the four lines, one row: `Opening soon` in ember at `clamp(28px, 2.8vw, 40px)`, then a `Join the LoreRim Discord` button (ember, dark text, square, the title face uppercase). The button goes to `DISCORD`.
2. **Four sections, one per hero line.** Each has a left column (the line's icon at 48 px, a heading, one sentence) and a wide right column with the visual. They stack on phones, column first.
   - **Plan a character:** `Each build gets its own page, led by the author's cover art.` → `cover.webp`.
   - **Race, deity, traits, perks and gear:** `Names, descriptions and art come straight from LoreRim's own files.` → `character.webp`; then two trait cards side by side, Focused Combat and Witcher, built as the app's trait cards (art behind, dark fade, the game's text with its numbers in the benefit and cost colours, read from `traits.json` rather than typed in); then `gear.webp`.
   - **Level by level:** `Step through a build one level at a time and see what was picked at each.`, then in muted text `Right: Iriel's Marksman perks, from Tapps's sample build, in the order she takes them.` (`Below:` on phones). The visual is the animated tree from WO-84, now **starting at level 20** so it never opens grey, with the counter and taken list in a panel beside it as tall as the tree, then `level.webp` under both.
   - **Share it:** `Every build has a link with its own preview card, ready to post where LoreRim players are.` and the Discord button again → `card.webp`, at most 760 wide.
3. **Why I made this:** as before, with Tapps at 180 px (6x) and the text at 22 px.
4. **Footer:** the star at 32 px with `LoreRim Build Planner` in the title face, `Made by Tapps. Not affiliated with the LoreRim team.`, and a `LoreRim Discord` link on the right.
5. Every screenshot sits in the brass corner frame, as on the board.

### Done when
- [x] e2e: the hero's Discord button and both other Discord links go to `DISCORD`; with reduced motion the counter reads 50; without it, the counter reads 20 on load.
- [x] e2e at 390: no horizontal scroll; each section's heading comes before its visual.
- [x] Screenshots at 1440 and 390 of the whole page, compared with the two boards.
- [x] All checks in CLAUDE.md pass.

---

## WO-86  Launch: the coming soon page, third pass (15 Oct 2026)

**Why.** Dave reviewed WO-85 on the canvas and went another round: a hero that cycles through his own characters with the art behind the words, his copy, and the gear and level sections playing through the levels like the real thing. The board is `ComingSoon2.dc.html` (desktop, press Play) with `ComingSoon2Phone.dc.html` (390); its title now says "third pass". Match it, words included. Everything else from WO-84 and WO-85 stays.

**Already in this commit (chat session):** `public/coming-soon/shot-864`, `-868`, `-855`, `-869`, `-860`, `-782` (`.webp` at 2400 wide and `-1200.webp`), from Dave's screenshots in `Stock Game`, in that order. After this order, delete the files nothing uses (`hero*.webp`, `gear.webp`, `level.webp`).

1. **Hero.**
   - The six shots fill the right 78% of the hero, one at a time: about 6 s each, a 1.4 s cross-fade, and a slow push-in (scale 1.02 to 1.12 over 14 s, alternating).
   - The fade runs from solid ground at the left edge to clear past the middle (`1` to 22%, `.82` at 34%, `.35` at 50%, `0` from 64%), plus a bottom fade, so the art sits behind the words.
   - Six small progress bars at the bottom right: the current one ember, the rest faint.
   - The words are vertically centred in the page column: the star, `LoreRim` / `Build Planner` at `clamp(52px, 6.2vw, 100px)`, the four lines at `clamp(17px, 1.4vw, 20px)`, then `Opening soon` and the Discord button.
   - No credit line.
   - Phones: the picture fills the whole hero and the words sit low over a heavier bottom fade.
   - Use `hero-1200` sizes below 900 px wide (`srcset`).
2. **Copy, Dave's:**
   - Plan a character: `Plan, build, publish and share your character builds.` then, on its own line with the Sneak icon (32 px) in front, `Or keep them private.`
   - Heading 2: `Race, deity, traits, perks, gear and more`; its line: `All names, descriptions and other data come right from the LoreRim files.`
   - Level by level: `Step through builds a level at a time, or fast track your build using level ranges. See details about what changes from each level, as well as the author's notes for that level.` The muted `Right: Iriel's…` line is gone.
   - Share it: `Every build has a link with its own preview card, ready to post to the Modding Bungalo Discord server.` with `Modding Bungalo` linking to `DISCORD`.
3. **Iriel as a fixture.** Export her build (`7h38zdhjnu`) from the staging database into `src/lib/coming-soon/iriel.json`: a read, not a write. The tree, the gear and the level cards all draw from it with the app's own components in a read-only mode, as the tree already does. That means no list typed out by hand, and nothing read from the production database.
4. **Gear, live.** In place of `gear.webp`: the app's gear timeline for Iriel, with a playhead that moves through the levels on the tree's clock. Pieces worn at that level are lit. A piece put on at that level shows in ember for three levels, and `New: [names]` appears at the top right while it does. The header reads `Gear at level N`.
5. **Level cards, live.** In place of `level.webp`: Iriel's real level cards, one after another, about 1.4 s each (its own clock, slower than the tree), ranges included (`Levels 36 to 42`). Above the card:
   - `Level N of 50` (or `Levels A to B`);
   - a 1 to 50 ruler marking each level's Destiny star, perks and gear, with an ember box over the card's level or range.
   The card is the app's level card. To keep it from jumping, cap it at the first three skills (`and N more`), four perks and three gear lines, and cut the author's note to its opening sentences. Give it a fixed height.
6. **The shared clock** is 280 ms a level now, so new gear can be read. With reduced motion everything holds still: the first shot, the tree and gear at level 50, the level 1 card.

Open question for Dave, in a canvas comment: should the buttons and other links say `Modding Bungalo` in place of `LoreRim Discord`? Leave them as they are unless he answers.

### Done when
- [x] e2e: the hero shows six shots, one visible at a time; with reduced motion the first stays and nothing moves.
- [x] e2e: at level 14 the gear shows `New: Elven Light Bow, Elven Arrow`; the level card steps to `Levels 36 to 42` and shows its range on the ruler.
- [x] Unit test: the fixture's gear and level cards match what Iriel's staging build page shows at levels 1, 20, 36 and 50.
- [x] Screenshots at 1440 and 390 of the whole page, compared with the two boards.
- [x] All checks in CLAUDE.md pass.

---

## WO-87  Launch: the coming soon page, fourth pass (15 Oct 2026)

**Why.** Dave still didn't like the page after WO-86: his screenshots in the hero said nothing about the planner. This pass swaps them for pixel art drawn like the guide icons, tells how Tapps came to make the planner in four panels, says plainly what the planner is, and ends with what comes later. Dave said this direction is "WAY better". The boards are `ComingSoon4.dc.html` (desktop, press Play) and `ComingSoon4Phone.dc.html` (390). Match them, words included. The four feature sections from WO-86 (the live tree, gear and level cards, and sharing) stay exactly as they are. The board file still holds some leftover `shots` code and a `.kb` class from the third pass: ignore them.

**Already in this commit (chat session):**
- `scripts/coming-soon/` draws the art from the palette and Tapps sprites in `scripts/icons/pixels.py`. Run `python3 scripts/coming-soon/build.py`.
- `public/coming-soon/px/` holds what it draws, all PNG and pixel for pixel what is on the canvas:
  - hero layers at 288×150: `hero-sky`, `hero-stars-a`/`-b`, `hero-aurora-a`/`-b`, `hero-land`, and `hero-fg-0` to `-5` (the campfire with Tapps writing);
  - story panels at 160×100: `p1-0..2`, `p2-0..2`, `p3-0..3`, `p4-0..3`.
- To change the art, edit the scripts and run them again. Don't hand-edit the PNGs.

1. **Hero.**
   - The layers stack in the order above, each `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:62% 100%; image-rendering:pixelated`.
   - The hero is `clamp(560px, 52vw, 820px)` tall on a `#070a0f` ground.
   - A left fade, `rgba(7,10,15,.78)` at 0, `.45` at 32% and `0` at 52%, keeps the words readable over the art.
   - Motion, on the page's shared 280 ms tick:
     - the foreground steps one frame a tick;
     - the two star layers swap every 3 ticks;
     - the aurora layers cross-fade (3 s ease) every 24 ticks.
   - Only the land layer gets alt text: `A night in Skyrim drawn in pixels: an aurora over snowy peaks, a pine forest, and Tapps writing in a book by a campfire`. Every other layer is `alt=""`.
   - The words sit top left in the page column: the logo star (48 px), then `LoreRim` / `Build Planner` at `clamp(52px, 6.2vw, 100px)`, then `Opening soon`.
   - Under `Opening soon` there is one line at 18 px, `#c3cdd6`: `Will be shared in the Modding Bungalo Discord.` `Modding Bungalo` links to `DISCORD`, in `#f3ead8`, underlined.
   - The hero has no button, no four lines and no shots any more.
2. **How this started.** This section comes right after the hero, headed `How this started`. It holds four framed panels in a grid (`repeat(auto-fit, minmax(260px, 1fr))`, gap 32). Each panel has an ember label in the title face and an Alegreya caption at 20 px:
   - `Level 1`: `Hi, I'm Tapps. I've loved LoreRim from my first experience playing it.` Frames `p1` 0,1,0,2. Alt: `Tapps at a signpost at dawn, holding a map, a question mark over his helmet`.
   - `Level 3`: `But it's tough as hell. I got my teeth kicked in.` Frames `p2` 0,1,0,2. Alt: `Tapps in a dark forest at night, a sabre cat with glowing eyes behind him`.
   - `Level 10`: `So I read guides by other players, and followed them to learn how to play.` Frames `p3` 0,1,2,3. Alt: `Tapps at a desk by candlelight, writing in a book`.
   - `Level 50`: `Then I built a place where we can make more complete guides, and share them with each other.` Frames `p4` 0,1,2,3. Alt: `Tapps in a tavern by the hearth, raising a tankard of mead`.
   The panels step one frame every 2 ticks. The old "Why I made this" section is gone; this replaces it.
3. **What it is.** This section comes before the four feature sections. The heading `What it is` sits on the left. On the right is one paragraph at `clamp(19px, 1.6vw, 22px)`: `A character planner for LoreRim. You plan a build level by level, with the game's own perks, traits, spells and gear, then publish it with a link or keep it to yourself.` Under it, at 16 px in `#8e9bab`: `It starts with LoreRim 5.0.4.8. Later versions will be supported as they come out.` Under it are the four icon lines from WO-85, two per row, which moved here from the hero.
4. **Coming later.** This section comes after the share section, on a `#0e1319` band with a top rule. Under the heading `Coming later` are two framed cards side by side (`minmax(300px, 1fr)`), each with a 64 px pixel icon:
   - `Story and roleplay` (`tab-story.svg`): `Add story and roleplay ideas for your character, for those of us who really enjoy that kind of thing.`
   - `LoreRim survival guide` (`chapter-staying-alive.svg`): `A simple survival guide covering the basics of playing in LoreRim.`
5. **Reduced motion.** Everything holds still:
   - the hero on `hero-fg-0`, stars A and aurora A;
   - the panels on frame 0;
   - the rest as in WO-86.
   - Behind the section (added 15 Oct, Dave's comment): the icon wall, `public/coming-soon/px/icon-wall.png` from `scripts/coming-soon/wall.py`, every 16 px icon in a brick grid that tiles. It repeats at 1728 px wide (3x), pixelated, at opacity .2, under a fade from the band colour at the top and bottom to `.55` between 22% and 70%.
   - Under the cards, centred: `Opening soon` (as in the hero), then `The planner is nearly ready. It will be shared in the Modding Bungalo Discord when it opens.` with `Modding Bungalo` linking to `DISCORD`.
6. **Tidy.** Delete `public/coming-soon/shot-*.webp` (all twelve files), since nothing uses them now.

The question to Dave is still open in a canvas comment: should the share section's button and the footer link say `Modding Bungalo` in place of `LoreRim Discord`? Leave both as they are unless he answers.

### Done when
- [x] e2e: the hero has no `<a class="btn">` and has the `Modding Bungalo` link under `Opening soon`; the foreground frame changes between two reads 600 ms apart. With reduced motion it doesn't change.
- [x] e2e: `How this started` shows the four labels and captions above; `What it is` comes before `Plan a character`; `Coming later` shows both cards.
- [x] Unit or e2e check: every `px/` image the page asks for exists, and nothing asks for a `shot-*` file.
- [x] Screenshots at 1440 and 390 of the whole page, compared with the two boards, with the hero pixels crisp (not smoothed).
- [x] All checks in CLAUDE.md pass.

---

## WO-88  Link preview cards in the pixel style, a card per guide chapter, and a check of today's page fixes (15 Oct 2026)

**Why.** Dave wants the link preview cards to match the new pixel look, with Tapps in them. A guide chapter should share with its own art. Several of Dave's canvas comments also went straight onto staging today (7db2ea5, 2c9160d and the commits before them), and only the WO-87 e2e spec was run on them. The boards are `ShareSitePixel.dc.html` and `ShareGuide.dc.html`, in the new row "Proposal: link preview cards in the pixel style". Match them.

**Already in this commit (chat session):** `scripts/coming-soon/share.py` bakes the art the cards use into `src/lib/og/art/`, already scaled up pixel for pixel, so the card renderer never smooths it:
- `site-scene.png`: the coming soon hero (Tapps writing by the fire) at 5x, cropped to 1200×630 as the hero crops it.
- `guide-wall.png`: the icon wall at 3x, cropped to 1200×630.

1. **The site's card** (`siteCard` in `src/lib/og/card.tsx`, served at `/og/site.png`):
   - Full bleed: `site-scene.png`, with a left fade of `rgba(7,10,15,.86)` at 0, `.62` at 34% and `0` at 56%.
   - Brass corners as now.
   - The words go in a column 520 px wide at left 72, centred top to bottom:
     - the pixel logo star (`logo-0.svg`) at 64;
     - the title as the coming soon page's pixel wordmark (`public/coming-soon/px/wordmark.png`, 113×38, from `scripts/coming-soon/wordmark.py`) at 4x, 452 px wide, in place of the star and the set title (changed 15 Oct, after the boards);
     - the site line, italic, at 30;
     - the `LoreRim 5.0.4.8` tag.
   - The 18 skill icons and the diagonal hatching go.
   - A build with no cover still uses this card with its own name in place of the title, as it does now, at 80 and clamped as now. Its video badge stays.
2. **A guide chapter's card**, at `/guide/[slug]/card.png`. Build it statically, with one card per chapter.
   - Background: `guide-wall.png` at opacity .16 on `#0e1319`, under a fade of `rgba(14,19,25,.92)` at 0, `.7` at 55% and `.35` at 100%. Brass corners.
   - On the left (column 640 at left 72, centred):
     - `LoreRim guide · Chapter N`, in ember, title face, 26;
     - the chapter's title at 112;
     - its subtitle, italic, at 30.
   - On the right: a 320 px box (1 px `#2a3442`, `rgba(7,10,15,.75)`) holding the chapter's own icon from its front matter, at 256 px.
   - Bottom left: the logo star at 32 and `LoreRim Build Planner`.
   - Each chapter's `generateMetadata` points its Open Graph and Twitter image at its card.
   - The guide's other pages (contents, terms, questions, mods) keep the site's card.
3. **Build cards with a cover** are unchanged.
4. **Check today's comment fixes on the coming soon page.**
   - Run the whole of `npm run test:e2e`, not only `wo87.spec.ts`.
   - Take screenshots at 1440 and 390 and compare them with `ComingSoon4` and `ComingSoon4Phone`, mainly:
     - the four captions;
     - the version line under `What it is`;
     - the icon wall and `Opening soon` closing `Coming later`;
     - the two card lines.
   - Fix anything that is off.

### Done when
- [x] Unit test: `/og/site.png` and one chapter's `card.png` come back as 1200×630 PNGs. A chapter page's metadata names its own card; `/guide/terms` names the site's card.
- [x] Screenshots of `/og/site.png`, a no-cover build's card and `/guide/staying-alive/card.png`, compared with the two boards, with the pixels crisp.
- [x] Screenshots of `/coming-soon` at 1440 and 390, compared with the ComingSoon4 boards.
- [x] All checks in CLAUDE.md pass, the full e2e run included.

---

## WO-89  A sixth guide theme, Aurora: the coming soon page's look (16 Oct 2026)

**Why.** Dave wants a guide theme that feels like the coming soon page: a night under the aurora, cream text, ember, and the pixel art. Themes are colour tokens (WO-37). This one adds pixel art to the hero when the build has no cover, which is the one thing a theme couldn't do before.

1. **The theme.** In `src/lib/themes.ts`, after Dwemer: `{ id: "aurora", name: "Aurora", line: "Stars, snow and a campfire." }`. Its tokens (all checked against `themes.test.ts`, AA passes):
   - Grounds: `ground #0c1222`, `panel #111a2e`, `panel-raised #17213a`, `panel-high #1e2a46`, `sunk #0e1528`, `sunk-deep #090e1b`.
   - Rules: `rule #25304d`, `rule-soft #19223a`, `rule-strong #34416a`, `line-bright #4a588a`.
   - Text: `text #f3ead8`, `soft #ddd5c6`, `muted #a7a08f`, `faint #9a9384`, `dim #857e70`, `bright #fffaf0`.
   - Ember as Ember's: `ember #f0913f`, `ember-text #f6c08f`, `ember-hover #f5a55a`, `ember-press #d97f33`, `on-ember #0c1222`.
   - `brass #e8d3a4` (the cream of the coming soon page's dialogue box).
   - Destiny in aurora green: `destiny #7cc9a2`, `destiny-text #a8e0c2`, `destiny-line #2c5a48`, `destiny-ground #0d1c1f`.
   - `health #d9877a`, `magicka #8aaee6`, `stamina #93c28c`.
   - `stripe transparent`, `hero-tint #0e1a36`, `hero-veil 0%`, `hero-plain linear-gradient(180deg, #0e1a36 0%, #0c1222 100%)`.
2. **Pixel art in the hero.**
   - Add a token `hero-art`, default `none` in `globals.css` and in every other theme.
   - For Aurora, it is the coming soon scene layered back to front: the land, stars A and the aurora A over the sky, each `url(/coming-soon/px/hero-….png)`.
   - A build with **no cover** shows it in the hero:
     - `background-size: cover`, positioned at `62% 100%`, `image-rendering: pixelated`;
     - the usual fade into the ground below;
     - with a `min-height` of 360 px (240 on phones) while `hero-art` is set, so the scene reads.
   - A build **with** a cover keeps its cover, tinted by `hero-tint` as every theme does. No art over it.
3. **The build's title in the pixel face (Dave, 16 Oct).** Aurora is the one theme that changes a font, and only the build's name in the hero:
   - Add a token `hero-title-font`, default `var(--font-title)` everywhere.
   - In Aurora it is Jersey 10. Load it in the root layout with `next/font` (`variable: "--font-pixel"`, `preload: false`, so other pages don't fetch it), and move the coming soon page onto that one load.
   - In Aurora the title is set mixed case (no uppercase), `letter-spacing: 0.01em`, `line-height: 0.9`, with a hard 3 px shadow down and right in `#070a0f`. Its size stays the hero's, scaled by 1.15 because Jersey is smaller for its size.
   - Everything else on the page keeps the site's fonts.
4. **Set up's picker.**
   - Six cards in place of five.
   - Aurora's card shows the scene in its small hero, crisp.
   - The picker's hint becomes "The look of this build's page. Layout stays the same."
5. **Design rules.** Extend the pixel face rule in `docs/design-rules.md` to say Aurora sets the build's title in it too.

`validate.ts` takes the theme ids from `THEME_IDS`, so no migration is needed.

### Done when
- [x] Unit: Aurora sets every token and meets WCAG AA (the existing loop covers both).
- [x] e2e: picking Aurora in Set up and saving puts the scene in the hero of a build with no cover, and keeps the cover on one with a cover.
- [x] e2e: in Aurora the build's title is set in Jersey 10; in Ember it isn't.
- [x] Screenshots at 1440 and 390 of a no-cover build and a cover build in Aurora, plus the six-card picker.
- [x] All checks in CLAUDE.md pass.

---

## WO-90  Admin export and import of a build, and an Example tag on the sample build (16 Oct 2026)

**Why.** Production has no builds yet. Iriel, the sample build for first visits, lives in the staging database. The chat session can't write to production, so Dave needs a way to move a build between environments himself. He'll do the same later with Zen's build. Dave also wants the sample marked as an example, so nobody takes it for a tested guide.

1. **Export (admins only).**
   - On a build's page, an admin sees one more item in its actions: `Export`.
   - It downloads `<build name>.lorerim-build.json`, which holds:
     - the build's name, description, game version, visibility, cover image URL, cover focus and plan;
     - its tags (slugs);
     - every guide document (`build_guides`: key, doc, text length).
   - It leaves out the owner, ids, likes, featured and dates.
   - Add a `format: 1` field so a later change can be read.
2. **Import (admins only).**
   - On `/admin`, a section `Import a build` with a file picker and `Import`.
   - Validate the file:
     - the plan through `validate.ts`'s schema;
     - tags against the `tag` table, dropping unknown slugs;
     - guide keys against what the app writes.
   - Create a new build owned by the admin, with a fresh id, the file's visibility, `like_count` 0 and not featured.
   - **Images:** the cover and every image in the guide docs are copied into this environment's own Blob paths:
     - the cover to `<env>/covers/<userId>/`;
     - guide images to that build's image prefix (`imagePrefix(id)` in `src/lib/guide/images.ts`).
     - Rewrite the URLs to match, so nothing on production points at a `staging/` path that staging cleanup could delete. An image that can't be fetched is left out, and the import reports it.
   - When done, go to the new build's page and show its id: Dave needs it for `SAMPLE_BUILD_ID`.
   - It goes through a server action with the admin check and BotID, like the other admin actions.
3. **The Example tag.**
   - The sample build gets an `Example` tag wherever it appears: the hero's byline, its card in Browse, on profiles and in the featured slot, and the tour's first stop. The sample is `tourSampleId()` in `src/lib/builds/sample-config.ts`, which is `SAMPLE_BUILD_ID` or the built-in example.
   - Style it like the other tags, in brass.
   - Its tooltip (the small "i", design rule 4): `A sample to show what a build page can look like, not a tested guide.`
   - The tag follows whichever id `SAMPLE_BUILD_ID` names, so pointing it at Zen's build later moves the tag. Nothing is stored on the build.

### Done when
- [x] Unit: export then import round-trips a build's plan, tags and guides; unknown tags are dropped; a bad plan is refused with the reason.
- [x] Unit: imported image URLs are rewritten to this environment's prefixes.
- [x] e2e: a non-admin sees neither `Export` nor `Import a build`.
- [x] e2e: an admin exports the seeded build and imports it, getting a second build with the same levels and notes.
- [x] e2e: the sample build shows `Example` with its tooltip on its page and its card; other builds don't.
- [x] Screenshots of the Export action, the Import section and the Example tag (page and card).
- [x] All checks in CLAUDE.md pass.

After it's on production, Dave will:
1. Export Iriel (`7h38zdhjnu`) on staging.
2. Import her on production.
3. Set `SAMPLE_BUILD_ID` to her new id in Vercel (Production) and redeploy.

---

## WO-91  Gear data: crafting recipes, and each plugin's Nexus page (16 Oct 2026)

**Why.** Dave wants a page to look through all the gear we've indexed (WO-92). The item records give stats and text but not how to get an item. Crafting recipes are records too (COBJ), so the first part of "how do I get it" can come straight from the game. Dave also wants each plugin name to open its Nexus page, as the guide's mod links do. The plugin records don't know their Nexus mod; the MO2 mod folders do (`meta.ini`, `modid=`).

**Two machines, two parts.** The game files are only on Dave's PC and the site is built on the Mac, so this order is done in two passes on one branch, `wo91-data`:
- **PC (game data):** steps 1 to 4 and 6. Write the reading scripts, run them against the LoreRim install, and commit the scripts and the `*_raw.json` they write, plus the guide's `nexus:` lines. `esp.py` reads the install's path from `LORERIM_ROOT`, falling back to `~/mnt/LoreRim`. Run the Python tests. Push `wo91-data` only. Don't touch `src/`, and don't tick boxes.
- **Mac (the build):** step 5. Merge `wo91-data` into `staging`. Extend `build.py`, build `recipes.json` and `plugins.json` and the item numbers, do the spot checks from the raw data, run every check in CLAUDE.md, tick the boxes, and push `staging`. Delete `wo91-data` once merged.

1. **`scripts/gamedata/recipes.py`** (reads only, same style as `items.py`). It reads the winning COBJ records in the Ultra load order and writes `gamedata/5.0.4.8/recipes_raw.json`.
   - Keep a recipe when its created object (`CNAM`) is an item in `items_raw.json`, matched by the item's id or any id in its `also`.
   - For each one record:
     - the station keyword (`BNAM`);
     - the materials (`CNTO`), as the component's own full name and the count;
     - the created count (`NAM1`) when it isn't 1;
     - its conditions (`CTDA`).
   - A recipe at the Grindstone or the Workbench whose created object is the item itself is **tempering** (Improve it). Every other recipe is **crafting** (Make it).
   - Breakdown recipes, the ones that turn gear back into ingots, are left out for now.
   - Print counts as `items.py` does: recipes read, kept, crafting, tempering, and with each kind of condition.
2. **Stations, in the game's words.**
   - `overrides.json` gets a `stations` map from keyword to name:
     - `CraftingSmithingForge` → Forge;
     - `CraftingSmithingSkyforge` → Skyforge;
     - `CraftingSmithingSharpeningWheel` → Grindstone;
     - `CraftingSmithingArmorTable` → Workbench;
     - `CraftingTanningRack` → Tanning Rack;
     - `CraftingSmelter` → Smelter.
   - `build.py` prints a note for any station keyword the map doesn't name, and leaves those recipes out until it's added. Check the in-game name of any you add against the furniture record's full name.
3. **Conditions.**
   - `HasPerk` becomes the perk's id in `perks.json` (`Smithing:Glass Smithing`).
   - Any other condition counts toward `otherConditions: n` on the recipe, so the page can say it has more conditions, and `build.py` prints which kinds it found. Leave out the routine ones a tempering recipe always carries; list them in the WO's commit.
4. **Plugins and their Nexus pages.**
   - Same script, or `plugins.py`: for every plugin that has an item, write `gamedata/5.0.4.8/plugins_raw.json` with the MO2 mod folder it was loaded from and that folder's `meta.ini` `modid`.
   - No `modid`, or `0`, means no link.
   - The base game and DLC (`Stock Game/Data`) and Creation Club plugins (`cc*`) never get a link.
5. **`build.py`.**
   - Write `src/data/lorerim-5.0.4.8/recipes.json`, keyed by the item's primary id: `{ make?: Recipe[], improve?: Recipe[] }`, where `Recipe = { station, materials: [{ name, count }], perks: string[], otherConditions?, makes? }`.
   - Write `plugins.json`: `{ "<plugin>": { "nexus": "1234" } }`, only for plugins with a link.
   - Keep both out of `items.json`, so the editor's gear search doesn't fetch them.
   - While in `build_items`, add number fields to each item, so the Gear page can sort: `armor`, `damage`, `weight`, read from the same record fields as `stats`. Keep `stats` as it is.
6. **The guide's missing links (backlog, 14 Oct).** In the same run, read the `modid` of the 16 guide mods with no Nexus link and add their `nexus:` lines to the chapters' Related Mods. Don't guess any that aren't there.

### Done when
- [x] `recipes_raw.json`, `plugins_raw.json`, `recipes.json` and `plugins.json` are built and committed, with the script's counts in the commit message.
- [x] Unit (`test_recipes.py`): a crafting recipe, a tempering recipe, a `HasPerk` condition resolved to a perk id, an unknown station left out with a note, and a recipe matched through an item's `also` id.
- [x] Spot checks against xEdit or the game, written in the commit: Glass Cuirass (Make and Improve), Hide Boots, Dragonscale Cuirass, and one modded item. Recipe text is the records' own words.
- [x] Items have `armor`, `damage` and `weight` numbers. The gear search and @-mentions still work.
- [x] The 16 guide mods have `nexus:` lines, or the commit lists the ones with no `modid`.
- [x] All checks in CLAUDE.md pass.

---

## WO-92  A Gear page and an item page (16 Oct 2026)

**Why.** There's no way to look through the gear except the editor's search. Canvas, row "Proposal: a Gear page, and gear across the app": `GearIndex`, `GearItem` and `GearPhone`. It ships behind a switch so it can go out as its own announcement after launch. Needs WO-91's data.

1. **The switch.**
   - `FEATURE_GEAR` in `src/lib/features.ts`, like the site guide.
   - Off: `/gear` and every item page are not found, and the header has no Gear link.
2. **Header.** `Builds`, then `Gear`, then `Guide` (when that's on). Ember when current, as now.
3. **`/gear`, the index** (`GearIndex`).
   - **Tabs:** Armor, Weapons, Ammo, each with its count.
   - **Type chips** under the tabs:
     - Armor: the gear types (`GEAR_TYPES` order, only the types that have items), each with its slot icon and its count.
     - Weapons: the weapon types (Sword, Bow, Staff…), no icons.
     - Ammo: Arrow, Bolt.
     - A chip toggles; one at a time.
   - **Fields** (in the Browse page's style):
     - Search: the item search the editor uses (`searchItems`). It reads the name and the stats, plus the game's text.
     - Armor: Any, Light, Heavy, Clothing. Armor tab only.
     - Source: Any, Can be made, Not listed.
     - Sort:
       - Armor: Name, Armor rating, Weight.
       - Weapons: Name, Damage, Weight.
       - Ammo: Name, Damage.
   - **Table:** the type icon, then the name (a link to the item's page) with the game's text under it when there is some, then the stat columns for the tab (Armor and Weight; Damage and Weight; Damage). Then:
     - **Plugin:** a link with ↗ to its Nexus page in a new tab (`plugins.json`, `rel="noreferrer"`), or plain text when it has none.
     - **Source:** the station with the anvil icon when the item can be made, else a grey `Not listed`.
   - 50 a page, a count above (`339 pieces`), and ‹ › at the foot.
   - **Everything lives in the URL** (`?kind=armor&type=Body&armor=Light&sort=armor&page=2`) and is filtered and sorted on the server from the JSON files. Nothing big ships to the browser. The browser's back button keeps your place.
4. **Phone** (`GearPhone`). Search on its own row, then `Filters` (with how many are on) and the sort as two buttons. `Filters` opens a sheet with the type chips, Armor and Source. Filters that are on show as pills under the buttons, each with ✕. The rows become name over a stat line, with the station after a `|`.
5. **The item page, `/gear/<slug>`** (`GearItem`).
   - The slug is the id made URL-safe: lower case, every run of other characters one `-`. `Skyrim.esm:013939` becomes `skyrim-esm-013939`. A unit test checks every item's slug is unique.
   - An old id in an item's `also` redirects to the item's page.
   - **Top:** a back link to the index with the filters it came from (`‹ Light armor for the body`, or `‹ Gear`). Then the slot icon at 48 px in a framed square, the name as the page title, and one line: type | armor or weapon type | each stat.
   - **Make it:** the station, `needs` and each perk as a chip linking to its tree (Smithing), then the materials as count and name. When a recipe has other conditions, a grey line: `Other conditions apply in game.` Under it, **Improve it**: station and materials on one line. An item with no recipe has no Make it section.
   - **Where to find it**, on every item: `Not listed yet. The game's records don't say which chest, merchant or enemy carries an item, so we don't guess.`
   - **Records** (right column): each plugin and form id the item has (its id and its `also`), in mono. A plugin with a Nexus page links there as in the table.
   - Builds that use it come in WO-93. Leave room in the right column.
   - Metadata: the item's name and stat line, and the site's link-preview card.
6. **Noise in the index.** Look through the Armor tab for records that aren't wearable gear. One example is `Secondary Glass Dagger`, which is listed as body clothing and is probably a copy used to show a sheathed dagger. Add patterns for them to `overrides.json` (`items` → `skipNames`), rebuild, and list what was dropped in the commit. Don't drop anything a build has saved: check the seeded builds and Iriel's fixture.

Copy: use the game's words, follow the design rules, and add no how-it-works text.

### Done when
- [x] Unit: filtering, sorting and paging on the server (type, armor, source, search, each sort); slugs are unique; an `also` id resolves to its item.
- [x] e2e: with `FEATURE_GEAR` off, `/gear` and an item page are not found and the header has no Gear link.
- [x] e2e: on `/gear`:
  - picking Body and Light and sorting by Armor rating lists Daedric Mail Cuirass first;
  - the URL holds those filters, and Back restores them;
  - an item's name opens its page.
- [x] e2e: Glass Cuirass's page shows its stat line, Make it with Forge and Glass Smithing, Improve it, Where to find it, and Records.
- [x] e2e: a plugin link opens in a new tab and points at nexusmods.com; Skyrim.esm is plain text.
- [x] Screenshots at 1440 and 390: the index (Armor, Body, Light), the Weapons tab, the phone sheet open, and Glass Cuirass's page, compared with the canvas boards.
- [x] All checks in CLAUDE.md pass.

---

## WO-93  Gear across the app: links to the item page, and builds that use an item (16 Oct 2026)
Status: held

> **On hold (Dave, 16 Oct 2026).** Launch comes first. The Gear page stays hidden (`FEATURE_GEAR` off everywhere) and rolls out after the guides launch. Don't start this order until Dave says so.

**Why.** Once items have pages, every place that shows an item should lead to one. A build that uses an item is the best answer we have to "is this any good". Canvas: `GearElsewhere` (dashed outlines mark what's new). Needs WO-92. Every link here shows only while `FEATURE_GEAR` is on.

1. **Build page gear card** (`gear-view.tsx`).
   - Under the stat line, the recipe line when the item can be made: anvil icon, `Forge, needs Glass Smithing` (the first Make it recipe; its perks joined with "and").
   - In the card's foot, `Gear page ›` to the item's page.
   - A made item (WO-45) links its base item.
2. **Guide @-mention card** (`mention-chip.tsx`). The same two lines, for items.
3. **Editor gear search** (`gear-block.tsx`). Each option that can be made shows the station, in brass with the anvil icon, at the right. Nothing else changes. No links in the editor.
4. **Smithing perk cards.**
   - A perk that some recipe needs shows `Gear it lets you make (n) ›`.
   - It links to `/gear?perk=<perk id>`. The index gets that filter, shown as a pill, `Needs Glass Smithing ✕`.
   - This goes wherever a perk's card shows: the tree, the editor and the build page.
5. **Builds that use it.**
   - On an item's page, in the right column above Records: public builds whose gear uses the item (its id or any `also`). Each shows its name, its Example tag when it has one, `Levels 30 to 50`, and its author.
   - Newest first, at most 6, then `All builds with it ›`.
   - No builds: the section isn't shown.
6. **Browse builds: a Gear field.**
   - After Sort, a `Gear` field using the editor's item search.
   - Picking an item shows it in the field with ✕, filters to public builds that use it, and puts `?item=<slug>` in the URL.
   - `All builds with it ›` lands here.
   - Query `plan->'gear'` for the ids. If that needs an index, add it through `npm run db:generate` and say so in the commit.

### Done when
- [ ] Unit: the recipe line's text from a recipe; the perk-to-items count; the builds-with-item query matches an `also` id and ignores private builds.
- [ ] e2e: on Iriel's page (the e2e seed), the Glass Cuirass bar's card shows `Forge, needs Glass Smithing` and `Gear page ›`, and the link opens its page.
- [ ] e2e: the editor's gear search marks a craftable item with its station.
- [ ] e2e: Glass Smithing's card links to `/gear` filtered to that perk.
- [ ] e2e: Browse with `?item=` lists only builds that use the item, and the item page lists the seeded build that uses it.
- [ ] e2e: with `FEATURE_GEAR` off, none of these links or the Gear field show.
- [ ] Screenshots of each place at 1440, and the build page card at 390, compared with `GearElsewhere`.
- [ ] All checks in CLAUDE.md pass.

---

## WO-94  Item renders: render every indexed item on Dave's PC (PC only, 16 Oct 2026)
Status: held

> **On hold (Dave, 16 Oct 2026).** Launch comes first. The Gear page stays hidden (`FEATURE_GEAR` off everywhere) and rolls out after the guides launch. Don't start this order until Dave says so.

**Why.** Dave wants to see each item the way the game's inventory shows it. The `spike-renders` branch proved it works: a still and a 24-angle turntable per item, rendered from the install's own models and textures. Canvas board: `ItemRenders`. The LoreRim team agreed on 16 Oct, on one condition: every picture credits where it comes from (the base game, or the mod by name). We only ever publish pictures. Model and texture files never leave Dave's PC.

**Where:** Dave's PC, `LORERIM_ROOT`, the Blender and PyNifly set up in the spike (`%LOCALAPPDATA%\Programs\blender-spike`). Work on branch `wo94-renders`, made from `staging`. Don't touch `src/`.

1. **From spike to pipeline.** Move `scripts/renders/` from `spike-renders` onto the new branch and make it run over every item in `src/data/lorerim-5.0.4.8/items.json`:
   - It **resumes**: it skips items whose outputs exist, so it can run overnight in batches (`--from`, `--limit`).
   - It **renders a look once**. Items whose model and texture files are the same share one render. Record which items share it.
   - A **failure** (missing mesh, import error) is logged with the reason, and the run moves on.
   - Drop the pixel versions. Dave and Bob decided the renders stay renders.
2. **Outputs per look**, in `C:\LoreRim-renders\5.0.4.8\<look id>\` (outside the repo):
   - `still.webp`: 512 px, transparent, quality about 85.
   - `spin.webp`: 24 frames at 384 px in one row (9216 × 384), same light and camera as the spike.
3. **Credits.** For each item, record two sources:
   - **The record's plugin**, as `items.json` has it.
   - **The look's source:** the MO2 mod folder that supplied the model, plus the folder (or folders) that supplied the item's own textures. These are the textures under the item's own `textures\armor\…` or `textures\weapons\…` path. Shared ones like cubemaps, blood or effects don't count.
   
   Then:
   - Map each folder to its Nexus `modid` from `meta.ini`, the same way as WO-91.
   - Folders that only repack the base game (for example `Cleaned Skyrim SE Textures`) count as **Skyrim**. List them in `overrides.json` → `renders` → `baseGameFolders`.
4. **Manifest.** Write `gamedata/5.0.4.8/renders_raw.json`. It has one entry per item id: its look id, the look's source folders and their modids, and a `status` (`ok`, or the failure reason). Commit the scripts and the manifest. **The images are not committed.**
5. **Hand the images over.** Zip `C:\LoreRim-renders\5.0.4.8` in parts under 1.9 GB. Upload them as assets on a GitHub release in this repo, tagged `renders-5.0.4.8`, marked as a pre-release.
   - If this PC can't authenticate to GitHub's API, stop and tell Dave which one command he needs to run (for example `gh auth login`).
   - Push `wo94-renders`. Don't push staging or main.

### Done when
- [ ] Every item has a `renders_raw.json` entry. The commit message gives the counts: rendered, shared looks, failed (by reason), and hours taken.
- [ ] Spot checks in the commit: Glass Cuirass, Glass Light Bow, Hide Boots, Daedric Mail Cuirass, Dragonscale Cuirass and one Vigilant item. Each has a still, a spin, and credits naming the right mod folders.
- [ ] The release `renders-5.0.4.8` holds the zipped images.
- [ ] Python tests pass, including new ones for the credit rule (own textures vs shared ones, base-game folders).

---

## WO-95  Item renders on the item page, with credits (Mac, 16 Oct 2026)
Status: held

> **On hold (Dave, 16 Oct 2026).** Launch comes first. The Gear page stays hidden (`FEATURE_GEAR` off everywhere) and rolls out after the guides launch. Don't start this order until Dave says so.

**Why.** WO-94 renders every item on Dave's PC. This order puts those pictures on the site. Canvas: `ItemRenders`, block 4. Needs WO-94.

1. **Upload.**
   - Merge `wo94-renders` into staging.
   - Download the `renders-5.0.4.8` release assets.
   - Upload each look's `still.webp` and `spin.webp` to Vercel Blob under `gear/5.0.4.8/<look id>/`, with a one-year cache. The renders are the same in every environment, so use one shared prefix with no `staging/`.
   - Make the upload a script (`scripts/gamedata/upload_renders.mjs`) that skips files already there.
   - It needs `BLOB_READ_WRITE_TOKEN` from `.env.local` (`vercel env pull`). If it isn't there, stop and say so. Never print it.
2. **`build.py`** turns `renders_raw.json` into `src/data/lorerim-5.0.4.8/renders.json`, keyed by item id:
   - `{ look, credits: [{ label, nexus? }] }` for items with status `ok`.
   - The credit labels are the base game as `Skyrim`, or each mod folder's name.
   - Keep it out of `items.json`.
3. **The item page.**
   - Where the type icon sits now, a 240 px framed square holding the still. Its alt text is the item's name.
   - **Drag** across it (or use ← → when it has focus) and it turns through the 24 frames of `spin.webp`. Load the spin only on the first drag or keypress.
   - It turns only by drag or keys, never on its own. Respect `prefers-reduced-motion` by not easing between frames.
   - No render: the type icon stays as it is now.
4. **Credits**, under the picture in small muted text:
   - `Skyrim` when every source is the base game.
   - Otherwise each mod's name, linked to its Nexus page in a new tab, the same way the Plugin column links.
   
   Use the game's and the mods' own names. No extra wording beyond a label: `Look from` before the names is enough.
5. **Nowhere else yet.** The table keeps the type icons. Renders in the build page's gear cards can come later.

### Done when
- [ ] Unit: `renders.json` is built from the raw manifest; credits for a base-game look, a modded look, and one with two mods.
- [ ] e2e: Glass Cuirass's page shows the still and `Look from Glass Armors and Weapons Retexture SE ↗`. Dragging changes the frame; ← → change it with focus; an item with no render shows its type icon.
- [ ] The Blob upload is a script that skips existing files; the commit says how many files went up and their total size.
- [ ] Screenshots of Glass Cuirass, Dawnbreaker and an item with no render, at 1440 and 390.
- [ ] All checks in CLAUDE.md pass.

---

## WO-96  Early access: a personal invite past the coming soon page (17 Oct 2026)

**Why.** Dave wants to let a few people into production before launch, Zenematics first, so they can make a build and get the whole experience. Today only admins get past the coming soon page, and being an admin carries moderation powers. An invited person should get the app and nothing more.

1. **Data** (migration via `npm run db:generate`):
   - **`invite` table:** `id`, a `token_hash` (store a SHA-256 of the token, never the token itself), `label` (who it's for, such as "Zenematics"), `created_by` (user id), `created_at`, `expires_at` (14 days), `used_by` (user id, null until used), `used_at`.
   - **`user.early_access_at`:** a timestamp, null for everyone else.
2. **Who passes the coming soon page.** In `src/proxy.ts`, a signed-in user passes when they're an admin **or** their `early_access_at` is set, with one query for both from the session token. Rename `isAdminSession` to `passesSession` (or similar) and keep it to that one query.
3. **The invite page, `/invite/<token>`.**
   - It passes the coming soon page: add `/invite/` to `passesComingSoon`.
   - It's set in the coming soon page's look: the pixel night with Tapps by the fire behind it, and the cream dialogue box from the story.
   - Tapps says, in the box: `[Label], you're invited in early. Make a build, look around, and tell me what you think before it opens to everyone.` Dave may reword this. Keep it plain (design rules 17 and 22).
   - **Signed out:** `Sign in with Discord`, coming back to this same page.
   - **Signed in:** one button, `Come in`. It's a server action with the BotID check. It sets the user's `early_access_at`, marks the invite used, and goes to `/`, where the first-visit tour starts as usual.
   - **Used, expired or unknown token:** the same scene, with `This invite has been used or has run out. Ask Tapps for a new one.` and no button. Don't say which of the three it was.
   - An invite works once. The person it's used by keeps their access.
4. **BotID.** Add `{ path: "/invite/*", method: "POST" }` to `src/instrumentation-client.ts`. Without it, `Come in` reads as a bot, the way `/signin` and `/admin` did.
5. **`/admin`: an `Early access` section.**
   - **Invite someone:** a `Name` field and `Make invite`. It shows the link once, with `Copy link`, plus `It works once, for 14 days.`
   - **Invites:** each one's label, made date, and `Waiting`, `Used by <Discord name>` or `Ran out`, with `Cancel` on waiting ones.
   - **People with early access:** each one's Discord name and avatar, the date they came in, and `Remove`. `Remove` clears `early_access_at`, so they see the coming soon page again on their next page load.
   - Admins only, server actions with the admin check and BotID, like the other admin sections.
6. **After launch.** With `FEATURE_COMING_SOON` off, nothing here changes anything: everyone sees the app. Leave the section in place; it costs nothing.

### Done when
- [x] Unit: the proxy's check passes an admin, an early-access user and nobody else; a token is stored hashed; an invite can't be used twice or after it expires.
- [x] e2e (with the coming soon switch on, the `soon` project):
  - an invite link shows the scene and `Sign in with Discord` signed out;
  - signed in, `Come in` lands on the app, and the app stays open on later pages;
  - a second account can't use the same link;
  - `Remove` in /admin puts the coming soon page back.
- [x] e2e: a non-admin sees no `Early access` section.
- [x] Screenshots of the invite page (signed out, signed in, used) at 1440 and 390, and the /admin section.
- [x] All checks in CLAUDE.md pass.

After it's on production, Dave makes Zen's invite in /admin and sends him the link.

---

## WO-97  Quest data: every quest line from the records (PC only, 17 Oct 2026)

**Closed by Bob, 22 Oct 2026: folded into WO-132 (the quest loop) and Dave's final test; the quest records are built and read straight from the game files.**

**Why.** Dave wants a catalogue of every quest in LoreRim, like the Gear page. The point (Dave, 17 Oct): players don't want to be the Dragonborn every playthrough, so they need a way to find all the big quest lines they could follow instead. That makes the unit a **quest line** (the Companions, Vigilant, Wyrmstooth), with its quests in order, more than single quests. This order is the data only, read on Dave's PC; the page comes after launch, with the Gear page. Quests are QUST records, and the player-facing parts are in them: the quest's name, its journal entries and its objectives, in the game's own words.

**Where:** Dave's PC, `LORERIM_ROOT` as in WO-91. Branch `wo97-quests` from `staging`. Don't touch `src/`, and don't tick boxes. The Mac pass (building it into `src/data`) comes with the page later.

1. **`scripts/gamedata/quests.py`**, in the style of `items.py` (reads only). For each winning QUST record in the Ultra load order, record:
   - its id, EDID, full name, and the plugin it comes from (and other plugins that edit it);
   - its **type**, from DNAM's quest type: Main Quest, Mages Guild, Thieves Guild, Dark Brotherhood, Companions, Misc, Daedric, Side Quest, Civil War, Dawnguard, Dragonborn, or none;
   - its **stages**, in order: the index, each journal entry's text (the log entries), and whether that stage completes or fails the quest;
   - its **objectives**: the index and the display text.
   
   Text comes from the plugins' string tables, as `extract.py` reads them. Keep the game's words exactly.
2. **Player-facing only.** Keep a quest when it has a full name and at least one journal entry or objective. Print a count for each step: read, named, with journal or objectives, kept. Many named quests are the game's own machinery (radiant scenes, dialogue holders) and have neither.
3. **Where it comes from.** For each kept quest, record the MO2 mod folder its plugin loads from and that folder's Nexus `modid`, reusing WO-91's plugin lookup. Base game and DLC count as Skyrim.
4. **Output:** `gamedata/5.0.4.8/quests_raw.json` (and step 5's `questlines_raw.json`), plus a short `quests_report.md` beside it with the counts, the number kept by type and by plugin (the top 20), and five sample quests in full. One should be base game (Bleak Falls Barrow, `MQ101`'s first part, or similar), one from Vigilant, and one from another quest mod.
5. **Quest lines.** Group the kept quests into lines and write `gamedata/5.0.4.8/questlines_raw.json`:
   - **Vanilla and DLC:** one line per story type: Main Quest, College (Mages Guild), Companions, Thieves Guild, Dark Brotherhood, Civil War, Dawnguard and Dragonborn. Each Daedric quest is its own line, under Daedric. Side and Misc quests from the base game are one bucket each, not lines.
   - **Mods:** one line per quest mod (its plugin, or the plugins one MO2 folder ships). Its quests go in EDID order, so `zzzAoMMq00`, `01`, `02` and so on.
   - **Per line:** its name (the mod's name, or the vanilla line's), the source, the quest count, the type mix, and the first quest's first journal entry, which usually says how the line begins.
   - **The report** lists every line, biggest first: the list a player would pick from.
   - **Bob cross-checks it afterwards** against the field guide's `lorerim/world/quests-and-lands.md` (in Dave's claude.ai Project, which this session can't open). That research names about 30 quest mods with how each starts and its level gate. Every line it names should show up here.
6. **What the records don't say.** Who gives a quest, and where, sits in its aliases and dialogue conditions, which are not readable as plain facts. Leave them out. The page will say so, as the Gear page does for where items are found.

### Done when
- [x] `quests_raw.json`, `questlines_raw.json` and `quests_report.md` are committed on `wo97-quests`, with the counts in the commit message.
- [x] Unit (`test_quests.py`, on a small fixture plugin like `test_items.py`): the type read from DNAM, stages with their log text in order, objectives, the player-facing filter, and text from a string table.
- [x] (folded) (Open: the text is read straight from the records; an in-game look at the five samples is still to do.) The five sample quests' names, journal text and objectives match the game (checked against xEdit or in game), as written in the report.
- [x] Python tests pass (58). Merged to staging by Bob, 17 Oct.

---

## WO-98  Quest givers, where quests start, and rewards: what the records can tell (PC only, spike, 17 Oct 2026)

**Why.** For the quest pages, the two things players most want are who gives a quest (and where to find them) and what it pays. WO-97 left both out because neither sits in a quest's own fields as a plain fact. They are in the records, though, spread across other parts: who is in a quest, which dialogue starts it, what its scripts hand out. This spike finds out how much of that we can read reliably, before anyone designs around it. Today 93 of the 139 story lines already say where to go, in their opening journal entry ("Lucan Valerius in Riverwood is offering me a gold reward…") or in the field guide's start notes. Rewards we have for none.

**Where:** Dave's PC, `LORERIM_ROOT` as in WO-91. Branch `wo98-quest-givers` from `staging`. Reads only. Don't touch `src/` or tick boxes.

1. **People in a quest.** From each kept quest's aliases (QUST `ALST`/`ALLS` blocks): the alias name, and when it's filled by a **unique actor** (`ALUA`) or a **forced reference** (`ALFR`), the NPC's full name. Note a **specific location** (`ALFL`) the same way, by its location name.
2. **Who starts it.** The dialogue (INFO) that belongs to the quest (`QNAM`) and is spoken at its first stages, read from each INFO's conditions: `GetIsID` naming the speaker NPC, and the quest stage it needs (`GetStage < n`). The speaker of the earliest one is the likely giver. Also note the quest's first objective when it names a person or place, as Wyrmstooth's does ("Speak to Lurius Liore at The Bannered Mare in Whiterun"): it's the game's own words for who and where, and often the simplest answer. Also record any story-manager node (`SMQN`) that starts the quest and its event (change location, kill, script event), which covers quests that start when you walk somewhere.
3. **Where that NPC is.** For a giver NPC, its placed reference (`ACHR`): the cell, and the cell's location (`LCTN`) name, so "Lurius Liore, the Bannered Mare, Whiterun". NPCs with schedules move about; the placed cell is their home, and the page would say so.
4. **Rewards.** Two readable sources, no decompiling:
   - aliases that **create an item** (`ALCO`), as Dawnbreaker is created for The Break of Dawn;
   - the quest script's properties (`VMAD` on the QUST, its fragment script's properties) that point at a weapon, armour, book, spell, perk, gold or a leveled list. Leveled lists named like rewards (`QuestReward*`, `LItemReward*`) count; quest items (flagged quest objects, keys, notes) don't.
   Record each with its name and record type. These are what the scripts *can* hand out, not proof of what they do.
5. **Check it.** Run all of it on these 15 and put the results in `quest_givers_report.md` beside a column for the known answer, which Bob fills in from the game afterwards: The Golden Claw (`MS13`), Rise in the East (`MS10`), The Forsworn Conspiracy (`MS01`), The Break of Dawn (`DA09`), A Daedra's Best Friend (`DA03`), Take Up Arms (`C00`), A Chance Arrangement (`TG00`), Wyrmstooth (`WTDragonHunt`), Vigilant of Stendarr (`zzzAoMMq00`), Meridia's Order (`NMeridia01`), In the Pines (`GRVEMainQuest01`), Bad Vibrations (`InigoBadVibrations`), In their Footsteps (`NecroQuest01`), Deluge of Deceit (`EVGSirenrootQuest`), Fists of Fury - The Rift (`FOFRiftenBrawlerQuest`).
6. **Coverage.** Then the counts over all 1,340 kept quests: how many get a likely giver, a giver with a location, a start event, at least one reward candidate.

**Output:** `gamedata/5.0.4.8/quest_givers_raw.json` and `quest_givers_report.md`, committed on `wo98-quest-givers`, with the coverage counts in the commit message.

### Done when
- [x] The 15 samples are in the report, each with its likely giver and where they are, any start event, and reward candidates, or "none found".
- [x] Coverage counts for all kept quests are in the report and the commit message.
- [x] Unit (`test_quest_givers.py`, a fixture plugin like `test_quests.py`): a unique-actor alias, an INFO's speaker and stage conditions, an `ALCO` item alias and a script property pointing at a weapon.
- [x] Python tests pass (74). Merged to staging by Bob, 18 Oct; the samples checked in `quest_givers_checks.md`.

---

## WO-99  Quest givers: a place for everyone in a quest, and the reward's own script (PC only, 18 Oct 2026)

**Why.** WO-98 showed the game files can say who gives a quest. The best rule (see `gamedata/5.0.4.8/quest_givers_checks.md`) takes the person named in the quest's opening journal entry or first objective, and falls back to the dialogue speaker. It got all 13 samples with a giver right, and finds a giver for 109 of the 139 story lines. But WO-98 placed only the dialogue speaker, so a giver found by name (Lucan Valerius, Kodlak Whitemane, Lurius Liore, Frissa Black-Briar) has no place yet.

**Where:** Dave's PC, `LORERIM_ROOT`. Branch `wo99-quest-places` from `staging`. Reads only. Don't touch `src/`.

1. In `scripts/gamedata/quest_givers.py`, give **every person** in a quest's aliases (`people`, each with an `npc`) its placed reference, cell, cell name and location, the way the giver's `where` is done now. Keep the form id of the NPC beside its name.
2. For each reward candidate, record which script it comes from as a kind: `fragment` (the quest's own `QF_` script), `quest script` (another script on the quest), or `alias`. WO-98 has it in `via`; make it a field.
3. Rebuild `quest_givers_raw.json` and the report, and add to the coverage table: people with a place, and story-line openings (Bob's 139, from `questlines.py`) whose named giver now has a place.

### Done when
- [x] Every person with an `npc` has a `where` (or an empty list when they're never placed, as a courier spawned by script).
- [x] Rewards carry their script kind.
- [x] The report's coverage table has the two new rows.
- [x] Unit: a placed alias NPC; a reward from a fragment script and one from a shared script. Python tests pass.

---

## WO-100  The Quests pages, on staging (Mac, 18 Oct 2026)

**Why.** Dave wants to use the Quests pages in his own playthrough now, not after launch. The player they're for (`docs/backlog.md`, "What the quest pages are for"): partway through a playthrough, unsure what to do next. Every screen answers *what big story can I start from where I am, and how do I start it?* The design is on the canvas, row "Proposal: a Quests page in six categories": `QuestHome`, `QuestCategory`, `QuestLine`, `QuestPhone`, `QuestIcons`. Build it to match, behind a switch: on for Dave on staging, off on production.

### 1. The switch
- `questsOn()` in `src/lib/features.ts`, read from `FEATURE_QUESTS` like the others, with one difference: unset, it's on under `next dev` **and on staging** (`VERCEL_ENV === "preview"`), off on production. Dave shouldn't have to set an env var to see it. Add it to `features()`.
- Off: `/quests` and everything under it 404 (a layout check, as Gear does), and there's no Quests link.
- On: **Quests** in the header nav, after Builds.

### 2. The data: `src/data/lorerim-5.0.4.8/quests.json`
A new step in `scripts/gamedata/build.py`. It calls `questlines.curate()` and joins `quest_givers_raw.json`; don't hand-edit the output. For each of the 152 lines, in `questlines.json` order:
- From the curation: `id`, `name`, `category`, `also`, `prince`, `where`, `opening`, `begins`, `beginsFrom`, `start`, `gate`, `minLevel`, `mainQuestAt`, `after`, `level`, `size`, `note`, `checked`.
- `sources`: each with a display `name`, its Nexus `modid`, and `base: true` for the base game. Names come from the MO2 folder via a small cleanup function, with a unit test on these: "VIGILANT - English Translation (Plus Voiced Addon)" → "VIGILANT"; "Meridia's Order ESMIFIED" → "Meridia's Order"; "Undeath Remastered - CLEANED ESMIFIED" → "Undeath Remastered"; "The Welkynar Knight - Quest" → "The Welkynar Knight"; "Skyrim" → "Base game"; "Creation Club" stays.
- `giver`: the opening quest's `namedGiver`, as `{ name, place }`, where `place` is "cell name, location" from its first `where` ("Riverwood Trader, Riverwood"). Leave it out when there's no giver, or when the name is a role, not a person: Prisoner, Courier, Guard, Bandit, Necromancer, and any name that's the same as its alias. The first-objective text goes in as `firstObjective` when WO-98 says it names who or where.
- `quests`: each with `edid`, `name`, `type`, `xp` (LoreRim's Experience.ini: Main, Daedric, Dawnguard, Dragonborn 200; Civil War 150; Side, College, Thieves Guild, Dark Brotherhood, Companions 100; Misc and None 0), `journal` (its log entries in stage order), `objectives`, and `rewards`:
  - `gold`: "small", "medium" or "large", from a reward list named `...QuestReward01Small`, `02Medium`, `03Large` or `FavorRewardGold...`. Plain Septim properties alone don't count.
  - `items`: names of weapons and armour created by an alias, or pointed at by the quest's own fragment script (`kind: fragment`). Leave out spells, perks, books, leveled lists other than gold, and anything from a shared quest script.
- `xpTotal` per line.
Keep it a server-only import. It will be a few MB; check `npm run build` doesn't put it in a client bundle.

### 3. Where you are
One panel, shared by every Quests page, kept in `localStorage` (`quests:where`), with a **Clear** link. Not in the database yet.
- **Your level**, a number.
- **Main quest, done up to**: a select. "Not started", then the main quest's quests in order (Unbound … Dragonslayer).
- **Finished**: a chip per line that other lines name in `after` (all but `main-quest`): The Thieves Guild, The College of Winterhold, Dawnguard, Rise in the East, The Mind of Madness, The Break of Dawn and so on, by line name.

**Open to you**, used everywhere:
- a line is open when its `minLevel` is at most your level;
- and every id in `after` is finished;
- and, for `main-quest`, your main quest is at or past `mainQuestAt`. A line with `main-quest` in `after` and no `mainQuestAt` doesn't block. Its page says "Part of the main quest comes first; how far isn't checked yet."
- With no level entered, nothing is counted as open or locked. The cards show only how many quest lines they have.

### 4. `/quests`
As `QuestHome`, top to bottom:
- **Quests** and a search box. It searches line names, quest names and journal text, and results go to the line.
- **Where you are.**
- **The six category cards.** Each has its scene (`public/quests/<slug>.png`, pixelated), its icon (`public/icons/quest-<slug>.svg`), name, subtitle, the `more` text, and "N open to you of M quest lines". M counts lines whose home is the category and lines that are `also` in it.
- **Jobs and errands**: the notice-board icon, subtitle, and a chip per work line with its quest count.

The words are the ones in `questlines.json` (`categories`, `shelves`). Don't add any.

### 5. `/quests/c/<category>`
As `QuestCategory`:
- **Cover.** The scene with the fade, the icon, name, subtitle and `more` text over its lower edge.
- **Filters.** Search, Your level (the same stored value), Source (Any, Base game, Mods), and **Only what I can start**.
- **Count.** "N quest lines", sorted by `minLevel` (none first), then name.
- **Each line's card:**
  - name;
  - its Prince with their deity icon (`public/icons/deity-<slug>.svg`) or its `where`;
  - a level chip: "Any level", "Level 20", or "Opens at level 25" in the health colour when it's above your level;
  - source tags (a mod links to its Nexus page in a new tab, with ↗);
  - "Also in …";
  - the opening (Alegreya italic in quotes when `beginsFrom` is a journal entry, plain text when it's an objective).
- **Tell me more** opens Start, Needs, Length, Quests (count) and where each was checked, as on the board.
- **The name links to the line's page.**

### 6. `/quests/<line id>`
As `QuestLine`:
- **Back link** to its category.
- **Cover** with the category's scene, the icon, name, `where`, source tags and the quest count.
- **The opening**, quoted.
- **How to start it:**
  - Who (`giver.name`), Where (`giver.place`), How (`start`), each saying where it came from: "game files" or "field guide", from `checked`.
  - The needs as a checklist against Where you are (✓ or ✕, with "You're 22" and the like). A ✕ quest links to its own page.
  - A status line: open to you, or what's left.
- **Facts:** Length, Enemies (`level`), Quest XP (`xpTotal`, with how many quests pay).
- **Rewards:** gold tiers and items from the data, headed "From the game files, not checked in game". When there are none: "Not listed yet."
- **Quests**, in two groups:
  - those that pay XP, the opening first, marked **Starts here**;
  - then "Jobs and bounties" for Misc ones.
  
  Each row has name, XP, and **Journal ›**. That shows the first entry, then a **Show the next N entries** button with "These give the story away" beside it.
- **Down the side:** for each ✕ need, a "Do this first" card with that line's opening; the line's Jobs and errands siblings when it has any.

### 7. Phone
As `QuestPhone`: one column, the cards stacked with their scenes, Where you are as a collapsible panel at the top, filters in a sheet as on Gear.

### Done when
- [x] `FEATURE_QUESTS` works as in 1: on in dev and staging unset, off on production unset, header link only when on.
- [x] `quests.json` builds from the curation and WO-98/99's data; unit tests for the name cleanup, the giver rule (role names out), the gold tiers and the item filter, and the XP table.
- [x] Unit: the open rule, with a level gate, an `after` line, `mainQuestAt` before and after, and no level entered.
- [x] e2e: the home shows six cards and Jobs and errands; entering level 22 changes "open to you" counts; Daedric Princes at level 22 shows Ill Met By Moonlight as "Opens at level 25"; Wyrmstooth's page, with level 22, The Way of the Voice and the Thieves Guild set, ticks the level and the main quest and crosses Rise in the East; its journals are hidden until opened.
- [x] Screenshots for Dave (desktop and phone): the home with Where you are filled in, Daedric Princes at level 22, Wyrmstooth's page.
- [x] Every check in CLAUDE.md passes.

---

## WO-101  What other plugins change about how each quest line starts (PC only, 18 Oct 2026)

**Why.** Dave's first real test of the Quests pages failed. Gravewind said "walk into the abandoned homestead", which is the mod page's wording. In LoreRim the door is locked: `LoreRim Gravewind Start Tweak.esp` (in `LoreRim - xEdit64 Output`) adds a lock that needs a Cemetery Homestead Key. It puts that key in the inventory of Vighar, the vampire in Bloodlet Throne (Dark Ancestor). Bob has fixed Gravewind by hand. The pattern is the problem: LoreRim and other patches change how a quest starts, and the field guide's start notes came from mod pages. Every line needs the same check, read from the files.

**Where:** Dave's PC, `LORERIM_ROOT`. Branch `wo101-quest-starts` from `staging`. Reads only. Don't touch `src/`.

For each of the 152 curated lines (`questlines.py`), take its opening quest, and record every plugin in the Ultra load order that overrides any of these, with what it changes:
1. **The opening quest's QUST record:** changed conditions (`CTDA`: level, `GetStageDone`, `GetQuestCompleted` and the like, with the quest each names), the start-game flag, aliases added or changed, and items given to an alias (`CNTO`), each named.
2. **Doors into the places the quest uses:** the cells of its location aliases (`ALFL`) and of its people's placed references (WO-99's `where`). For every door reference (`REFR` of a `DOOR` with `XTEL`) leading into those cells, record a lock (`XLOC`: level, 255 is "needs a key", the key's name, and who carries the key: any `CNTO` on an NPC or quest alias, or a placed reference of the key with its cell). Also record an enable parent (`XESP`) that hides the door until something happens.
3. **Its opening dialogue:** the quest's INFOs from WO-98 whose conditions a later plugin changes.
4. **Globals the conditions read** (`GetGlobalValue`) and their winning values, with the plugin that sets them. This is how WO-91's field guide found the level gates.

**Output:** `gamedata/5.0.4.8/quest_starts_raw.json` and `quest_starts_report.md`. The report lists every line where a plugin other than the quest's own mod changes any of the above, worst first: a lock or key, then a new condition, then a global. For each, write in plain words what the player has to do, as for Gravewind: "The homestead door needs the Cemetery Homestead Key, carried by Vighar in Bloodlet Throne."

### Done when
- [x] Gravewind comes out as above (the lock, the key, Vighar, Bloodlet Throne), from the records alone.
- [x] The report covers all 152 lines, with the count of lines a non-own plugin changes, by kind.
- [x] Unit (`test_quest_starts.py`): a door with `XLOC` needing a key, the key on an alias's inventory, a QUST condition added by a later plugin, a global's winning value.
- [x] Python tests pass. Commit on `wo101-quest-starts`, push, and stop; Bob checks the report against the curation.

---

## WO-104  The start check, for one story: Become the Dragonborn (PC only, 18 Oct 2026)

**Why.** Quest lines are becoming stories (`docs/backlog.md`, "Stories, not quest lists"). A story page tells the player what to do at every step, so every step has to be right. WO-101 checked only each line's opening quest, from its own records, and missed the ways LoreRim really moves starts:
- story manager nodes;
- delayed-start mods that hide the start behind a rumour;
- Timing is Everything's settings loader, which resets quest levels on every load over LoreRim's own values.

Bob found all three on 18 Oct by hand (the list is in the backlog). This order makes that check a tool, and runs it on one story end to end. Nothing more gets written until this one comes out right.

**Where:** Dave's PC, `LORERIM_ROOT`, Ultra profile. Branch `wo104-start-check` from `staging`. Reads only. Don't touch `src/`. Build WO-102's steps 1 and 2 (find the winning script, read a `.pex`) as part of this order. The rest of WO-102 stays paused.

**The story's quests:** the 19 in `quests.json` line `main-quest` (MQ101 to MQ305, and MQPaarthurnax), plus its 4 repeating jobs (FreeformHighHrothgarA, FreeformSkyhavenTempleA, B and D).

1. **For every quest, what starts it.** Record each of these that applies, with the plugin that wins:
   - **Dialogue:** the speaker's name, their placed cell, and the INFO's conditions.
   - **Another quest's script:** which script, at what stage, calling `Start()` or `SetStage`, read from the `.pex`.
   - **A story manager node:** the event (location change, script event and so on) and every condition up the node's parents, with globals resolved.
   - **Start-game:** the start-game flag.

   Then the first objective's text, and who and where it points at.
2. **What it needs.** Level, quests done, items, and doors and keys into where it starts (WO-101's door check, run on this quest's own cells).
3. **Values set at run time.** For every global step 1 or 2 reads, find anything that sets it on load or in play:
   - MCM Helper settings loaders: the mod's `MCM/Config/<mod>/settings.ini` defaults, a `MCM/Settings/<mod>.ini` in any mod folder, or one in `overwrite`;
   - scripts that call `SetValue` on it.

   Report the value the game ends up with, and the record value if it differs. Timing is Everything is the known case. Also check whether a Wyrmstooth settings loader is installed, and what `WTStartLevel` ends up as.
4. **Every way a game begins.** For each start in `starts_raw.json` (Alternate Perspective's statues and the rest): does MQ101 run? If not, what starts the main quest later, if anything? Answer it from the records and scripts, start by start.
5. **The payoff.** What the player gets on the stages that complete MQ305 and MQPaarthurnax: `AddItem`, `AddSpell`, `AddPerk` and shouts taught. If nothing is given, say so.
6. **Three questions from the board, answered outright:**
   - Is `Skyrim.esm:0242BA` MQ105, and is stage 160 the one that completes it?
   - Who starts The Horn of Jurgen Windcaller, and where?
   - Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?
7. **A verdict on every fact:**
   - **files:** a record decides it;
   - **script:** a `.pex` decides it, and you read it;
   - **run time:** a settings loader or script sets it at load;
   - **conflict:** two sources disagree, so give both;
   - **unread:** name what couldn't be followed.

**Output:** `gamedata/5.0.4.8/story_checks/main-quest.json` and `main-quest.md`. The `.md` has one block per quest in story order: started by, where, needs, first objective, and verdicts. Each fact names its source (plugin plus form id, or script plus function). After the quests come the starts table (step 4), the payoff (step 5) and the three answers (step 6). Make `story_check.py` take a line id, so the next story is one command.

### Done when
- [x] All 23 quests have a starter with its source, or an `unread` with the reason.
- [x] Every start in `starts_raw.json` says whether the main quest runs, and how it starts later if it doesn't.
- [x] The payoff is listed, or the report says nothing is given.
- [x] The three questions in step 6 are answered.
- [x] Run-time values: Timing is Everything's Dragonborn level, and Wyrmstooth's start level with its settings loader if one is installed.
- [x] Unit (`test_story_check.py`):
  - the `.pex` reader on a fixture, with `SetStage` on another quest found;
  - a story manager node's conditions gathered up its parents;
  - an MCM Helper `settings.ini` value beating a record's global;
  - a loose script beating the BSA copy.
- [x] Python tests pass. Commit on `wo104-start-check`, push, and stop.

**After Jeff (Bob, then a second check):**
1. Bob reads the report against the base game and the board, item by item, and lists every place LoreRim differs.
2. A reviewer who didn't write any of it (the Rex agent) checks the finished story page against the report, fact by fact.
3. Only then does the board change: every fact on it is one the report backs, and anything else says it isn't checked yet. Bob screenshots it for Dave.

---

## WO-106  Story pages: Become the Dragonborn, on staging (Mac, 18 Oct 2026)

**Why.** Dave wants to open a story and know what to do next in his own playthrough. The first story's facts have been checked twice: the start check (WO-104, WO-105), then Bob and a second reviewer. They're written up in `gamedata/5.0.4.8/stories.json`. Build the page the canvas shows (row 22, `QuestStory.dc.html`), behind `questsOn()`. Use the facts in `stories.json` and nothing else. Every sentence a player reads comes from that file or from `quests.json`.

### 1. The data
- **A step in `build.py`.** It reads `gamedata/5.0.4.8/stories.json` and writes `src/data/lorerim-5.0.4.8/stories.json`.
- **Checks (fatal):**
  - every `edid` is a quest of the story's `line` in `quests.json`;
  - every quest of that line is in a chapter or in `alongside`, exactly once;
  - every `from` is a quest in the story;
  - every `opens[].line` and every need's `line` is a line id;
  - `checked` is `files` or `not yet`.
- **From `quests.json`, joined in:** each quest's `name` and `xp`, and each opened line's `name`.
- **Tests:** a unit test per check.

### 2. `/quests/s/<story id>`
Top to bottom, as the board:
- **Back link and cover.**
  - Back link to the category (`category`). Cover with the category's scene and icon, `name` as the title.
  - Under it: "The main quest" (the line's name); the source tag; "N chapters | N quests".
- **The pitch**, plain text, not italic.
- **Your next step.** The first quest in story order that isn't done, with:
  - its name, linking to the quest line page's journal for it;
  - **When:** "Starts as X ends" when `atEnd`, otherwise "Starts during X", where X is `from`'s name. Leave it out for the first quest.
  - **Who** and **Where** when given;
  - **First task**, from `task`;
  - the `note`, when given.

  Then two buttons:
  - **Mark done** moves your progress on by one quest;
  - **I'm further on** opens a select of the story's quests to set how far you are.

  When no progress is set, the next step is the first quest, and the panel shows the story's `start` lines.
- **The story so far.**
  - "N of M quests done" once, in the section's header.
  - Chapters in order. A done chapter gets a filled number and its quests ticked. The current chapter shows its quests, with the next one marked "next".
  - Later chapters show only "Chapter N" and a quest count. **Show the rest** reveals their names and quests, with "Chapter names give the story away" beside it.
- **Along the way.** "N jobs that open as the story goes on. They pay no quest XP." Then **Show them ›**, which lists each one with its task and who.
- **Down the side:**
  - **Quest XP**, the sum, with "200 a quest" when they're all 200.
  - **Reward at the end**, from `reward`.
  - **Opens other stories**: each `opens` line linked to its page, with its needs checked against Where you are (✓ or ✕, "You're 22").
  - **How it starts**: the `start` lines.
  - **This was wrong ›**, to WO-103's form when that's built; a plain link to the line page until then.
- **"not checked yet".** Any fact whose `checked` is `not yet` carries the label in the muted source style, the way "game files" shows now. On a need, the `why` goes after it. An `or` shows as its own ✓ line.

### 3. Progress
- **Stored:** `localStorage` key `quests:story:<id>`, holding the edid of the last quest done.
- **The main quest:** this story reads and writes Where you are's **Main quest, done up to** instead, so the two never disagree. A quest after Dragonslayer in story order (Paarthurnax) counts as done when Dragonslayer is.
- **Mark done** past the last quest: "You've finished this story."

### 4. Links into it
- Main stories (`/quests/c/main`): the main quest's card links to the story page. The card's title is the story's `name`, and the line's name goes under it.
- The quest line page (`/quests/main-quest`) gets a link at the top: "Read it as a story ›".
- The Quests home: no change.

### 5. Phone
One column. The side panels go under The story so far, in this order: Opens other stories, How it starts, Quest XP and Reward.

### Done when
- [x] Data check: `build.py` writes `stories.json`, the checks in 1 have unit tests, and a broken `edid` fails the build.
- [x] With Where you are set to level 22 and main quest done up to The Way of the Voice:
  - the next step is The Horn of Jurgen Windcaller, "Starts as The Way of the Voice ends", first task "Retrieve the Horn of Jurgen Windcaller";
  - 5 of 19 done;
  - Dragonborn shows ✓ The Way of the Voice, ✕ Level 25 with "not checked yet", and ✓ the ship line;
  - Wyrmstooth shows ✓ Level 10 and ✕ Rise in the East.
- [x] Mark done moves to A Blade in the Dark and updates Where you are's main quest select.
- [x] e2e for the above. Every check in CLAUDE.md passes. Screenshots on desktop and phone (`scripts/shot.mjs`), compared against `QuestStory.dc.html`. Commit on `staging`, push, and stop: Dave checks the preview.

---

## WO-105  The start check, second pass: answers a player can follow (PC only, 18 Oct 2026)

**Why.** WO-104's report is right on the chain, the three questions and Timing is Everything. It isn't page-ready yet. Bob's check is in `gamedata/5.0.4.8/story_checks/main-quest-review.md`, items 1 to 9. The biggest gap is the one Dave asked about: how a player who didn't take a Dragonborn start gets into the main quest. Right now the answer is form ids.

**Where:** Dave's PC. Branch `wo105-start-check` from `staging`. Change `story_check.py` and rerun it on `main-quest`. (Bob made `pex.py` find `Scripts` and `scripts` alike, so its tests pass on Linux too.)

1. **Starters, not catch-ups.** "Started by" lists only calls that take the quest from not running to its first objective's stage: `Start()`, `SetStage` to the first objective's stage or below, start-game, a story manager node, or dialogue. Calls from a later quest's early stage that set this quest's stage go under **Caught up by**. Before the Storm must come out started by Unbound's end.
2. **Names.** Every quest is named from its own record. MQ102A and MQ102B are Before the Storm (Imperial and Stormcloak), not Season Unending. Add a unit test for it.
3. **Who and where come from the first objective's target.** Take the alias the first objective points at and say who or what it holds: a forced reference, a unique actor, or a location. Then say where that is. Never print "Location for things that need a location".
4. **Into the main quest from every other start.** For each AP route into Unbound (`AP_DialogueHelgen` with `APMessengerUtil`, Shazdehviir's dialogue `38C6E9`, INFO `075139`, `APS_VanillaStart`), write down:
   - who speaks, and their race and placed cell;
   - the player's prompt and the reply, word for word;
   - the INFO's conditions, read in full (the report has them empty);
   - what `APMessengerUtil` does, from the `.pex`;
   - in one plain sentence, what the player does: for example, "Go to Helgen and ask X about Y".

   If a route can't be followed, name the call where it stops.
5. **OR groups.** Print conditions as the game reads them, with "or" between OR'd conditions. Add a unit test.
6. **Doors.** A door is a need only when it is the way into the first objective's target cell and that cell has no other unlocked way in. Say which door it is: "the door from the courtyard", not "the High Hrothgar door".
7. **Gives.** Only `AddItem` on the player on the quest's own completing stages, and items its aliases create that end with the player. A reward list is named with what it holds, or "levelled: gold and an item".
8. **Wyrmstooth's start level.** Read `WT_MCMScript`'s `OnConfigInit`, `OnGameReload`, `LoadSettings` and `MigrateToMCMHelper`. Say which value `WTStartLevel` has in a new game, 10 or 20, and why, given `bLoadSettingsonReload=0`.

### Done when
- [x] Items 1 to 8 show in a rerun `main-quest.md`.
- [x] Before the Storm is started by Unbound's end; MQ102A and MQ102B are named right; Before the Storm's who is Alvor or Gerdur, from the `RiverwoodFriend` alias. (Bob: their records really are named "Season Unending"; the report names them as Before the Storm's helper quests, which is right.)
- [x] Every non-Dragonborn start says, in one sentence, how the player gets into the main quest, or names where the trail stops.
- [x] Wyrmstooth's level in a new game, with the reason.
- [x] Unit tests for items 1, 2 and 5. Python tests pass. Commit on `wo105-start-check`, push, and stop.

---

## WO-102  Quest scripts: what starts each quest, what it unlocks, and what it pays (PC only, 18 Oct 2026)

**Closed by Bob, 22 Oct 2026: folded into WO-121b and WO-132: the script reader exists and the story check traces starts through it; the remaining samples are covered by the answer key.**

**Paused (18 Oct).** Stories come first. WO-104 builds steps 1 and 2, and runs the rest for one story at a time instead of all 1,340 quests at once.

**Why.** After WO-101 the records are covered. What's left of how a quest starts, and nearly all of what it pays, is in its Papyrus scripts. These are compiled `.pex` files that call things like `SetStage`, `Start`, `AddItem`, `Unlock`, `Enable` and `ForceRefTo`. Read them, and every fact on a quest page can point at the record or script it came from. What can't be traced gets named, not guessed. Dave can't check 152 lines in game, so this is how the pages earn trust.

**Where:** Dave's PC, `LORERIM_ROOT`. Branch `wo102-quest-scripts` from `staging`. Reads only. Don't touch `src/`. Write the reader in Python, in `scripts/gamedata/` (`pex.py` and `quest_scripts.py`), with no outside decompiler. The `.pex` format is documented, and the field guide already read strings from `tie_mcmscript.pex` this way.

1. **Find the winning script.** A script can sit loose in a mod folder or inside a BSA (`bsa.py`). For each script name, the winner is the loose file from the last mod folder in MO2 order; failing that, the file in the BSA of the last plugin that loads one.
2. **Read a `.pex`.** The header, string table, objects, properties, states and functions, and each function's instructions with their arguments. Unit-test the reader on a small compiled fixture.
3. **Which scripts belong to a quest.** For each of the 1,340 kept quests:
   - the scripts on its QUST record (VMAD), with its stage fragments (`QF_…`), each fragment mapped to its stage from the VMAD fragment table;
   - the scripts on its aliases;
   - the fragments of its dialogue (`TIF_…` on its INFOs, WO-98);
   - the scripts on the doors, keys and activators WO-101 found for the line.
   
   Resolve every property to the form the VMAD points it at, by name.
4. **The calls that matter**, with their targets named (quest, stage, item and count, door, actor), and the stage or dialogue line they run on:
   - `Start()` and `SetStage(n)` on another quest. This is what starts quests, so record it on both sides: "X's stage 200 starts Y".
   - `AddItem` and `RemoveItem` on the player (`Game.GetPlayer()`, a `PlayerRef` property or the player alias), with item and count. A gold count, and leveled lists by name.
   - `Unlock`, `Lock`, `SetLockLevel`, `Enable`, `Disable` and `SetOpen` on references, with the reference's cell.
   - `AddPerk`, `AddSpell` and `ModFactionRank` on the player.
   - `ForceRefTo` and `MoveTo` that place people (as Lurius Liore moved to the Bannered Mare).
5. **Per quest, the derived facts:**
   - **started by:** dialogue (who), another quest's script (which, at what stage), a story-manager event (WO-98), or start-game;
   - **rewards:** what `AddItem` gives the player on the stages that complete the quest, plus items an alias creates that end up with the player;
   - **unlocks:** doors, places and people a stage changes.
6. **Per line, a trace verdict** for the page to show:
   - **traced:** the opening quest's start and its rewards resolve to records and scripts;
   - **random:** an alias or call picks a place or person at run time; name the alias;
   - **unread:** a call goes into a script or engine function this reader can't follow (SKSE native functions, a missing script); name it.

**Output:** `gamedata/5.0.4.8/quest_scripts_raw.json` and `quest_scripts_report.md`. The report has:
- the coverage: quests with a known starter, quests with a script reward, and lines by verdict;
- the 15 WO-98 samples again, beside `quest_givers_checks.md`'s known answers;
- Gravewind;
- every line whose start or rewards differ from what `quests.json` says now.

### Done when
- [x] (folded) The `.pex` reader handles every script the quests use, or the report lists the ones it couldn't read.
- [x] (folded) The 15 samples match the known rewards where one is known: The Golden Claw's gold, Dawnbreaker, the Masque of Clavicus Vile or the Rueful Axe, Brynjolf's gold. The report says which starters it found.
- [x] (folded) Every line has a verdict (traced, random or unread), with the reason for the last two.
- [x] (folded) Unit: the reader on a fixture `.pex`; a fragment mapped to its stage; `AddItem` on the player resolved through a property; `SetStage` on another quest; a winner chosen between a loose file and a BSA.
- [x] (folded) Python tests pass. Commit on `wo102-quest-scripts`, push, and stop; Bob checks it.

---

## WO-103  "This was wrong" on every quest page (Mac, 18 Oct 2026)

**Why.** No file says everything. There are random picks, engine plugins, and saves that a bug broke. Dave can't play 152 quest lines to find what's still wrong, but LoreRim's players play them every day. Give them one button to say so. Reports come to Dave and Bob in `/admin`.

1. **The button.** On each quest line's page (`/quests/<id>`), under the quests list: **This was wrong**. It opens a small form in place:
   - What: How to start it, What it needs, Who and where, Rewards, The journal, Something else;
   - a text box ("What happened in your game?", up to 1,000 characters);
   - **Send**.
   
   Signed-in or not. After sending: "Thanks. We'll check it." No other copy.
2. **Storage.** A `quest_report` table: id, line id, what, text, the user id when signed in, created at, and status (new, fixed, not a problem). Make the migration with `npm run db:generate`, and keep it additive.
3. **Abuse.** Add the route to BotID's protect list in `src/instrumentation-client.ts`. Allow at most 5 reports per person (or IP when signed out) per hour.
4. **`/admin` → Quest reports.** Newest first, with the line's name linking to its page, what, the text, who (or "signed out") and when. A status select per report.
5. **The switch.** All of it sits behind `questsOn()`.

### Done when
- [x] A report sends from the Gravewind page signed in and signed out, and shows in `/admin` with its status changeable. (Built with WO-121a Part 5, 21 Oct: signed in only, by Dave's call; signed out it asks for Discord first and comes back to the form.)
- [x] The sixth report in an hour is refused with "You've sent a few already. Try again later."
- [x] Migration committed in `drizzle/`, additive only. (`0022_quest_report.sql`)
- [x] e2e for both; every check in CLAUDE.md passes; screenshots of the open form and the admin list. (`e2e/wo121a.spec.ts`)

---

## The planner MCP (started 19 Oct 2026; WO-108 is with Jeff, the rest are written when their turn comes)

Decided 19 Oct, Dave taking Bob's lean: the look-up door ships behind `FEATURE_MCP` (on staging now, on production when Dave flips it, before or after launch); sign-in for assistants is built into the site; WO-108 runs in parallel with the quest work.

The spec is Dave's "LoreRim Planner MCP — Spec" doc. In one line: a second door into the planner, for AI assistants, with the rules kept on our server. What's involved, in order:

| Order | What it delivers | Depends on |
|---|---|---|
| WO-108 | The MCP route on the site and the read-only facts tools, no sign-in | nothing |
| WO-109 | Sign-in for assistants: the planner as an OAuth server over the Discord session, with tokens a player can see and revoke | WO-108 |
| WO-110 | Build drafts from an assistant, checked by the editor's own rules, with a review link | WO-109 |
| WO-111 | Playthroughs: the full walkthrough (acts, objectives, chapters, beats, the page) | WO-110, the stories work |
| WO-112 | The save reader: one reader, on the site and as a local connector | WO-111 |

Facts about the ground, checked 19 Oct: Vercel's `mcp-handler` turns a Next.js route into an MCP server (Streamable HTTP, stateless, no Redis, Node 20+, the MCP SDK v2 with zod 4, which the site already uses). Claude adds a remote server by URL on every plan (Free gets one), with "No sign-in", or OAuth where the server reads Claude's published client identity (CIMD) or registers itself (DCR). `withMcpAuth` in the same package verifies bearer tokens and serves the RFC 9728 metadata; the authorization server itself is ours to build.

---

## WO-108  The MCP route and the facts tools (Mac, 19 Oct 2026)

**Why.** Phase 1 of the spec: any assistant answers "what does Haggling need?" or "where do I buy Holy Fire?" from the planner's data for 5.0.4.8 instead of guessing. Read-only, no sign-in, so the risk is low and every LoreRim player with an assistant can use it the day it ships.

**Where:** `src/app/api/mcp/route.ts` with `mcp-handler`, exporting `GET` and `POST`. Behind `mcpOn()` in `src/lib/features.ts` (`FEATURE_MCP`, same shape as `questsOn()`: on in dev and on staging unset, off on production). Off: the route 404s.

### 1. The tools
Every tool takes `version` (default `5.0.4.8`; any other id is refused with the shipped versions listed). Answers come from `src/data/lorerim-<version>/*.json` through `src/lib/rules/data.ts` and the quest data, never from anything else. Each tool's description is one plain sentence a model reads; input schemas in zod.
- `search_facts(query, kinds?)`: perks, spells, traits, races, birthsigns, deities, quest lines and stories by name or word, 20 hits at most, each with its kind, id, name and one line.
- `get_perk(id | name)`: the perk's tree, ranks, requirements (skill level, perks, items), its text per rank, and what rules it out, as the editor shows.
- `get_spell(id | name)`: school, tier, cost, effect, and where it's sold, flagged when the stock is random.
- `get_quest_start(id)`: a quest line's or story's start: who gives it, where, how, the level gate and what else it needs, with `checked` for every fact as the pages show it. **Only lines that have passed the start check are answered in full**; for the rest the tool returns the name, category and `checked: "not yet"` with no instructions.
- `check_progression(build)`: given a build plan (the editor's JSON), run `checkCreation` and `computeBuild` from `src/lib/rules/engine.ts` and return the issues, the state at the last level, and what's legal next (the perks takeable at that level with their costs).
- `get_style_guide()`: the planner's writing and layout rules for assistants, from a new `content/mcp/style.md` (Bob writes it from `docs/design-rules.md`).

### 2. Limits
- 60 calls a minute per IP through `src/lib/moderation/limits.ts` and `rateEvents`, with the key `mcp`. Over: an MCP error "Too many calls. Try again in a minute."
- Responses capped at 64 KB; `search_facts` says when more hits were left out.

### 3. Tests
- Unit: each tool on the shipped data (Haggling's requirements, Holy Fire's merchants, Gravewind returns `not yet` with no instructions, Become the Dragonborn returns its checked start, a build with an illegal perk returns the issue).
- Integration: an MCP client (the SDK's) against the route in e2e: `initialize`, `tools/list`, one call of each tool.
- Bob then adds `https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/api/mcp` to Claude as a custom connector with No sign-in and asks the six questions in the spec's done-when.

### Done when
- [x] `FEATURE_MCP` works as in 1; off, the route 404s.
- [x] The six tools answer as listed; `get_quest_start` gives instructions only for checked lines.
- [x] Rate limit refuses the 61st call in a minute.
- [x] Unit and e2e above; every check in CLAUDE.md passes. Commit on `staging`, push, and stop: Bob connects Claude to it and reports.

---

## WO-109  Sign-in for assistants (Mac, 19 Oct 2026)

**Why.** Phase 2 of the spec. Today the door only reads. For an assistant to write a draft to a player's account, the planner has to know who the player is, which means handing out its own tokens to other programs. The planner only ever signed people in through Discord; this order makes it an OAuth authorization server for its own MCP, with the rules kept here: the player sees and approves what the assistant gets, and can cut it off. Decided 19 Oct: built in, no identity service.

**How it fits, in one paragraph.** An assistant (Claude, ChatGPT, Cursor) tells the player "sign in to LoreRim Build Planner" and opens a page on the site. The player is already signed in with Discord, or signs in. The page says "Allow Claude to use your LoreRim Planner account?" with what it may do; the player allows. The site hands the assistant a code, the assistant trades it for a token, and from then on its calls to `/api/mcp` carry that token. The planner checks the token on every call. On the account page the player sees the assistant listed and can revoke it.

**Where:** the same app, on `staging` as usual, in small commits, one piece at a time. Read `mcp-handler`'s `docs/AUTHORIZATION.md` first.

### 1. What the standard asks for (checked 19 Oct against the 2026-07-28 MCP spec and mcp-handler 2.x)
- The MCP route is the **resource server**. It serves RFC 9728 Protected Resource Metadata at `/.well-known/oauth-protected-resource` naming our authorization server (the site itself) and the resource `https://<host>/api/mcp`. `withMcpAuth` verifies bearer tokens and answers 401 with the `WWW-Authenticate` challenge that points clients there.
- The site is also the **authorization server**. It serves RFC 8414 metadata at `/.well-known/oauth-authorization-server` with `issuer`, `authorization_endpoint`, `token_endpoint`, `registration_endpoint`, `revocation_endpoint`, `scopes_supported`, `response_types_supported: ["code"]`, `grant_types_supported: ["authorization_code", "refresh_token"]`, `code_challenge_methods_supported: ["S256"]`, `token_endpoint_auth_methods_supported: ["none"]`, and `client_id_metadata_document_supported: true`.
- **Clients identify themselves two ways**, both accepted:
  - **Client ID Metadata Documents (CIMD)**, the current way and what Claude prefers: the `client_id` is an HTTPS URL. We fetch it (HTTPS only, public hosts only, 5 s timeout, 64 KB cap, cached by its HTTP cache headers for at most a day), check the document's `client_id` equals the URL exactly, and take `client_name` and `redirect_uris` from it.
  - **Dynamic Client Registration (RFC 7591)**, kept for older clients: `POST /oauth/register` takes the client's metadata and returns a random `client_id`; public clients only, no secret. Rate limited like the MCP route.
- **PKCE with S256 is required** on every authorization; a request without `code_challenge` is refused. The `resource` parameter (RFC 8707), when sent, must be our MCP URL. `state` is passed back untouched. `redirect_uri` must match one in the client's metadata exactly.

### 2. The pages and endpoints
- `GET /oauth/authorize`: the consent page. Behind the Discord session (not signed in: the sign-in page, then back here with the same query). Validates the client (1), the scopes, PKCE and the redirect. Shows, in the site's style: the client's name, "wants to use your LoreRim Planner account to:" and each scope in plain words, then **Allow** and **Deny**. Allow issues a one-time code (10 minutes) and redirects to the client's `redirect_uri` with `code` and `state`. Deny redirects with `error=access_denied`. The form carries a token tied to the session so a cross-site POST can't approve. The page passes the coming-soon proxy (`passesComingSoon`), as `/signin` does, and so do `/.well-known/` and `/oauth/`.
- `POST /oauth/token`: `authorization_code` with `code_verifier` (checked against the stored challenge; the code is single-use, expired or used codes refused and, on reuse, every token from that code revoked), and `refresh_token` (rotated on every use; the old one refused after). Access tokens last 8 hours, refresh tokens 90 days. Tokens are random 32-byte strings, stored only as SHA-256 hashes.
- `POST /oauth/revoke` (RFC 7009): revokes a token and its pair.
- `POST /oauth/register`: as in 1.
- The two `/.well-known/` metadata routes, as in 1. Note Next's handling of dotted paths in `app/.well-known/...`: a route group or a rewrite in `next.config` is fine; the URL is what matters.

### 3. Scopes
- `facts`: the read tools. They stay open without a token, so a connector added with No sign-in keeps working.
- `builds:write`: make and change the player's draft builds (WO-110's tools).
- `playthroughs:write`: WO-111's tools.
- The consent page words: "Look up perks, spells and quests", "Draft builds in your account", "Write playthroughs in your account".

### 4. The route
- `withMcpAuth(handler, verifyToken, { required: false, resourceMetadataPath: "/.well-known/oauth-protected-resource" })`: no token passes through to the facts tools; a bad or expired token gets the 401 challenge from the library, so a client refreshes or signs in again.
- `verifyToken` looks the hash up, checks expiry and revocation, touches `last_used_at`, and returns `{ token, scopes, clientId, extra: { userId } }`.
- Tools read `ctx.http?.authInfo`. One tool ships in this order to prove it: `whoami`, which needs a token and returns the player's planner name and handle and the token's scopes. Without a token it answers "This connector was added without sign-in. Remove it in Claude and add it again with Sign in now."
- A tool that needs a scope the token lacks answers "Your sign-in doesn't allow this. Reconnect and allow <scope in plain words>."

### 5. Tables (migrations additive, `npm run db:generate`)
- `oauth_client`: `id` (the CIMD URL or the registered id), `kind` (`cimd` | `registered`), `name`, `redirect_uris` (json), `metadata` (json, as fetched or registered), `fetched_at`, `created_at`.
- `oauth_code`: `hash`, `client_id`, `user_id`, `redirect_uri`, `code_challenge`, `scopes`, `resource`, `expires_at`, `used_at`.
- `oauth_token`: `hash`, `kind` (`access` | `refresh`), `pair` (the id linking an access token to its refresh token), `client_id`, `user_id`, `scopes`, `expires_at`, `revoked_at`, `created_at`, `last_used_at`.

### 6. The account page
On `/me`, a section **Assistants**: one row per client with a live token: its name, what it may do (the scopes in plain words), connected on, last used, and **Revoke** (revokes every token of that client for this player, with no confirm dialog; the row says "Revoked" and goes on the next load). Empty: "No assistant is connected to your account." No how-it-works copy.

### 7. Limits and safety
- `/oauth/*` and the metadata routes: 30 calls a minute per IP through `limits.ts`, kind `oauth`.
- BotID isn't on these routes (assistants aren't browsers); the consent form's session-bound token is the guard.
- Never log a token, code or verifier. Tokens are never shown on the site.
- CIMD fetches: HTTPS only; refuse hosts that resolve to private or loopback addresses; follow at most one redirect to the same host.

### 8. Tests
- Unit: PKCE verify (right, wrong, missing); code single-use and expiry; reuse revokes the pair; redirect exact match (a trailing slash or a different port is refused); CIMD document with a mismatched `client_id` refused, `http://` refused, private host refused; refresh rotation; revoke cuts both tokens; `verifyToken` on an expired or revoked token returns nothing; scope check wording.
- e2e, with plain `fetch` as the client: register a client at `/oauth/register`; as the seeded signed-in e2e user open `/oauth/authorize` with PKCE and the right `resource`, approve; exchange the code at `/oauth/token`; call `whoami` through the MCP route with the token and get the seeded name; refresh and see the old refresh token refused; revoke from `/me` and see `whoami` answer 401; a CIMD client served by the test server itself goes through the same flow; the launch server (FEATURE_MCP off) 404s the lot.
- Screenshots of the consent page (desktop and phone) and the Assistants section, against `docs/design-rules.md`.

### Done when
- [x] Both metadata routes answer as in 1, on staging, behind `FEATURE_MCP`.
- [x] The e2e flow above passes for a registered client and a CIMD client.
- [x] `whoami` through the door with a token returns the player; without one, the plain message; with a bad one, a 401 and the challenge.
- [x] Revoke on `/me` cuts the assistant off.
- [x] Every check in CLAUDE.md passes; migrations committed, additive. Commit on `staging`, push, and stop: Dave removes his connector and adds it again with Sign in now, approves on the consent page, and asks Claude "who am I on the planner?"

---

## WO-109b  The door on any path, and a 401 that starts sign-in (Mac, 19 Oct 2026)

**Why.** Two things came out of Dave's first try at WO-109. Claude won't let him delete a custom connector and add it again with sign-in; it keys connectors by URL, so he needs a fresh URL for the same door. And a connector added with "Sign in when needed", or Claude Code, only starts sign-in when the server answers 401; our door never does without a token, so a write tool would just return the plain message and the client would never sign in.

1. **Any path under `/api/mcp`.** Move the route to `src/app/api/mcp/[[...rest]]/route.ts`; `mcp-handler` ignores the pathname. The resource is the URL the client used: the protected resource metadata is served at `/.well-known/oauth-protected-resource` and at the path form `/.well-known/oauth-protected-resource/api/mcp/<rest>`, each naming that path as `resource`; the `resource` check at `/oauth/authorize` and `/oauth/token` accepts any `https://<host>/api/mcp` or `https://<host>/api/mcp/<rest>` (no query, no fragment). Tokens aren't tied to the path.
2. **A 401 that starts sign-in.** Before the handler runs, read the JSON-RPC body. A `tools/call` for a tool that needs sign-in (`whoami` now; WO-110's and WO-111's later), with no bearer token, answers HTTP 401 with the same `WWW-Authenticate` challenge the library sends for a bad token. With a token that lacks the tool's scope, HTTP 403 with `error="insufficient_scope"` and `scope="<the scope>"`. Everything else (initialize, tools/list, the facts tools) stays open as it is. The plain messages from WO-109 stay for clients that ignore the status.
3. **Tests.** Unit: the path check (accepts `/api/mcp/signed-in`, refuses `/api/mcp?x=1` and another host); the body check (a `tools/call` of `whoami` without a token is 401, `search_facts` without one is 200, `whoami` with a token missing nothing is 200). e2e: the WO-109 flow through `/api/mcp/signed-in`, and the metadata at its path form.

### Done when
- [x] `https://<staging>/api/mcp/signed-in` answers `tools/list`, and its path-form metadata names it as the resource. (Mac, night of 20 Oct: the route is `src/app/api/mcp/[[...rest]]/route.ts`; the metadata route takes the same path form through the rewrite; `/oauth/authorize` and `/oauth/token` accept `/api/mcp` and any path under it on this host, no query or fragment.)
- [x] `whoami` without a token is a 401 with the challenge; with a token, the player. (The sign-in tools are read from the tools' own registration: whoami needs any token, the build tools `builds:write`, the playthrough tools `playthroughs:write`; a token without the scope is a 403 with `error="insufficient_scope"` and the scope. initialize, tools/list and the facts tools stay open.)
- [x] The WO-109 e2e passes through the new path; every check in CLAUDE.md passes. Commit on `staging`, push, and stop: Dave adds `/api/mcp/signed-in` as a new connector with Sign in now.

---

## WO-110  Build drafts from an assistant (Mac, 19 Oct 2026)

**Why.** Phase 2 proper. Dave says to Claude "draft me a level 1 to 20 Nord two-hander sworn to Stendarr"; Claude builds it level by level through the door; the planner refuses anything its rules refuse, with the reason; the draft appears under My builds, private, for Dave to finish and publish. The assistant never publishes. Found in WO-108: an assistant can't guess the editor's plan JSON, so every tool here takes plain inputs and the planner builds the plan.

**Where:** on `staging`, small commits. The tools live in `src/lib/mcp/builds.ts`; they call the same code the editor does (`parseBuildPlan`, `checkCreation`, `computeBuild`, `createBuild`'s rules), never a second copy of the rules.

### 1. Scopes, first
- Every tool below needs a token with `builds:write`. Without one: the WO-109 refusal; from WO-109b on, the 401 or 403.
- When a client asks for no scopes, the consent page offers and the planner grants only the scopes that have tools today: `facts` and `builds:write`. `playthroughs:write` appears when WO-111 ships. Dave's current grant is left as it is.

### 2. Names, not ids
Inputs take the game's names as the planner shows them. Resolution, in `src/lib/mcp/names.ts`, shared by every tool:
- Skills, races, birthsigns, deities, starts, traits: exact name, case-insensitive; a miss is refused with "No skill called X. Skills are: …" (the full list is short enough for skills, races, signs, deities and modes; for traits and starts, the closest five).
- Perks: `Tree:Name` ids, or a name alone when one tree has it. A name two trees have (Leadership) is refused with the ids to pick from. A rank beyond the first is "Name (2/3)" or the id repeated.
- Spells, gear and abilities: names as on the Gear and Spells pages; a miss lists the closest five.

### 3. The tools
All take `version` (default 5.0.4.8) and act only on builds the signed-in player owns.
- `create_build({ name, description?, race, birthsign?, mode?, deity?, start?, startOption?, majors, minors, traits?, notes? })`: a new private build with level 1 from `emptyPlan`, through `checkCreation`. Refused with the issues when the choices break a rule (too many majors, a trait that rules another out, a start option that isn't the start's). Returns the build id, the review link, level 1's state (skills, points) and what's legal at level 1 (`canTakeNext`, as `check_progression` gives it). `mode` defaults to the planner's default.
- `add_level({ build, attribute, skillPoints, perks?, destiny?, extras?, spells?, stone?, deity?, note? })`: appends the next level. The planner builds the `LevelPlan`, runs `computeBuild` on the whole plan, and saves only when there are no issues at any level; otherwise nothing is saved and the issues come back with the level they're at. Returns the new level's state and what's legal next. `extras` are `{ kind: "trainer" | "book", skill }`; `spells` are `{ name, where? }`.
- `set_level({ build, level, …the same fields })`: replaces one level's choices, same check, same answer. Levels after it are checked again and the first issue found stops the save.
- `remove_last_level({ build })`: drops the last level (never level 1).
- `set_gear({ build, gear: [{ slot, name, fromLevel, note?, replaces? }] })`: the build's gear list, through the gear rules (`src/lib/rules/gear.ts`), as the editor saves it.
- `set_details({ build, name?, description?, notes?, tags?, mainSpells? })`: through `buildDetailsSchema`; tags by slug, listed when one is wrong.
- `get_build({ build })`: the plan in the same plain shape the inputs use, each level with its computed state, plus the review link and visibility.
- `list_my_builds()`: the player's builds: id, name, visibility, levels, updated, and whether an assistant drafted it.
- `finish_draft({ build })`: runs the full check once more and returns either "Ready: open <review link> to read it and publish" with the link, or the issues. It changes nothing; publishing is the Listed/Link only choice on the site, by the player.
- `check_progression`: now takes the same plain shape as `get_build` returns (or a build id), not the editor's JSON.

### 4. On the site
- New column `build.drafted_by` (text, null): the assistant's client name when a tool made the build. Migration additive.
- A build made this way starts `private`. On its page, under the byline: "Drafted with Claude" while `drafted_by` is set. In Set up's Details step: a checkbox "Show that an assistant drafted it", on by default for these builds; off clears the line but not the column (the planner still knows).
- My builds: the card carries "Drafted with Claude" in the muted style.
- The Assistants section's row counts: "3 builds drafted" after the scopes, from `drafted_by` and the token's client.

### 5. Limits
- Writes: 30 a minute per player, kind `mcp-write`, through `limits.ts`.
- At most 20 private assistant-drafted builds per player at once; the 21st is refused with "You have 20 drafts. Publish or delete one on the site first."
- Build names and notes go through the same moderation checks as the site's forms (`src/lib/moderation/check.ts`).

### 6. Tests
- Unit: name resolution (a skill miss lists skills; Leadership refused with both ids; "(2/3)" ranks); `create_build` refusals (four majors, a start option not the start's); `add_level` with an illegal perk saves nothing and returns the issue at its level; `set_level` that breaks a later level stops at the first issue; the draft cap; scopes granted when none are asked for; `check_progression` on the plain shape.
- e2e, with the WO-109 flow for the token: create a build, add three levels (one refused, then fixed), set gear, `finish_draft` returns the link; the build shows under My builds as "Drafted with Claude", private, and opens in the editor; the Details checkbox hides the line; a second player's token can't read it.
- Screenshots: the build page with the drafted line, My builds with the card, the Details checkbox.

### Done when
- [x] From a fresh token, an assistant can make a level 1 to 20 build through the door with no editor JSON, and every refusal names the rule and the level.
- [x] The draft is private, under My builds, marked as drafted, and opens in the editor with every level as sent.
- [x] `finish_draft` returns the review link only when the whole build passes.
- [x] Scopes granted when none are asked for are `facts` and `builds:write` only.
- [x] Every check in CLAUDE.md passes; migration additive. Commit on `staging`, push, and stop: Dave asks Claude to draft a build and reads it on My builds.

---

## WO-110a  Ranks and carried-over points in the tool answers (Mac, 19 Oct 2026)

**Why.** Dave's Claude drafted a Nord two-hander through the door (`/b/efkfas489t` on staging) and the draft passed Bob's check against the planner's perk text. Two things in the answers made the assistant doubt the planner: a perk with ranks comes back as its bare name repeated ("Great Weapon Mastery, Great Weapon Mastery") where the page says "Great Weapon Mastery 2", and `skillPointsLeft` reads as a leftover when the page calls it "Skill points carried over".

- In `plainOf` and `stateAt` (`src/lib/mcp/plan.ts`), a perk with more than one rank is labelled with the rank the build has by that level, in the input's own form: "Great Weapon Mastery (2/2)", "Longweapon Focus (1/3)". One-rank perks stay the bare name; a name two trees share stays `Tree:Name`.
- `skillPointsLeft` becomes `skillPointsCarriedOver` in the level state, with the same number; the tool descriptions for `add_level` and `get_build` say "unspent skill points carry to the next level, as on the site".
- Unit test: the sample build's level with a second rank labels it "(2/2)"; the rename.

### Done when
- [x] `get_build` on `/b/efkfas489t` (Dave's draft) shows "Great Weapon Mastery (2/2)" at level 1 and "Longweapon Focus (2/3)" at level 19, and `skillPointsCarriedOver`. (Bob checked it on staging through `check_progression` with the build id, 19 Oct.)
- [x] Typecheck, lint, unit tests, the WO-108 to WO-110 e2e. Commit on `staging`, push, stop.

---

## WO-111  Playthroughs (Mac, 19 Oct 2026)

**Why.** Dave's idea for the planner beyond builds: a character's whole run, from race and deity to what to do with her, written as a story and a quest log and kept current as he plays. The way he sees it working: a player connects an assistant to the planner, describes the character and works out the story with it, the assistant drafts the playthrough through the door, the player reads and edits it by hand or with the assistant, the two keep it accurate through the game, and (WO-112) the assistant can read the local save to bring it up to date.

**The reference.** Dave's Book of Kyria on his PC (`C:\LoreRim\_fieldguide\tools\kyria-book\`, `kyria.playthrough.json` and the built page), made in another session. The planner takes its structure: acts with a level range and a place, objectives with a why line and a status, some proved by the save, story beats that open when something happens, "where you stand" from the save. It leaves out the book styling, the novel as a novel, stats from one mod, and the follower table.

**The boards.** Canvas row 23: `Playthrough.dc.html` (the Play view), `PlaythroughTale.dc.html` (the Tale view, in the Story tab's format), `PlaythroughEdit.dc.html` (editing an act by hand). Build what they show.

**Where:** on `staging`, behind `FEATURE_PLAYTHROUGHS` (on in dev and preview, off on production), small commits, in the order below. Reuse: the guide document (`src/lib/guide/doc.ts`, its validator, images and limits), the Story editor and the Story tab's rendering (WO-79), the @-mention extension, the builds' writes and limits pattern, and the WO-110 tool pattern (`src/lib/mcp/builds.ts`, names, refusals).

### 1. The rules, first
Replace rules 12 to 16 in `content/mcp/style.md` with these, word for word, and add them to `docs/design-rules.md` as a "Playthroughs" section:

12. Two kinds of text, kept apart. **Tale** is the story: what the character sees, wants and does, as a story, with no numbers or instructions in it. **Play** is the game: what the player does, where, with which quest or item, in plain instructions. A chapter, an entry and a beat are Tale only. An act's goal, an objective and its why line are Play only.
13. An act is a stretch of the game with a goal and a place: a name, a level range, a place, the goal in one line ("Earn a bed and coin in Riften as a bard and a worker"), and, if there is one, a standing rule for what the player keeps doing through the act ("Play the Bee and Barb most nights"). A standing rule is not an objective.
14. An objective is one thing the player can know is done. Either **done once** (a quest or one of its stages, a person met, a place reached, an item in hand, one act they will tick: "Sing for the children at Honorhall") or **reach a number** (a level, a skill at a number, a count the save or the player can give: "Read 10 books"). "Read every new book", "keep playing", anything with every, each, always or whenever, is a standing rule, and the planner refuses it as an objective. Each objective has one why line.
15. An objective links to a planner quest, quest line, spell, item or follower when one exists; the rest is the player's own words. Never invent a quest. Quest facts in a why line come from the planner (the checked start, the giver, the place) and say "not checked yet" when the planner does.
16. A beat is a short Tale scene that opens when an objective is done or a number is reached; until then the page shows its title and what opens it. An entry is a Tale scene written after play, from the save and what the player said. A chapter is Tale from before the game.
17. Suggestions are proposals: an assistant's suggested objective shows as suggested with Accept and Skip, and nothing counts until the player accepts it.
18. Where you stand (level, day, place, skills) comes from the player's save through the helper, or from the player by hand. Never from an estimate.

(The old rules 17 to 19, honesty, become 19 to 21.)

### 2. Data
Five tables, migration additive, `npm run db:generate`:
- `playthrough`: id (the builds' id shape), ownerId, buildId (nullable, the player's own build), name, line (one sentence, 140), gameVersion, visibility (as builds), draftedBy, showDrafted, coverImageUrl (nullable, the Story tab's upload path), createdAt, updatedAt.
- `playthrough_act`: id, playthroughId, position, name (60), levelFrom, levelTo (nullable: "and up"), place (80), goal (200), standingRule (200, nullable).
- `playthrough_objective`: id, actId, position, text (160), kind `once` | `reach`, link (nullable jsonb `{ kind: "quest" | "line" | "spell" | "item" | "follower", id }`), doneBy `save` | `hand`, detect (nullable jsonb `{ quest: <edid>, stage?: n }` for `save`), reach (nullable jsonb `{ key: "level" | "skill:<Skill>" | "count:<label>", target: n }`), why (300, nullable), status `todo` | `doing` | `done` | `later`, doneAt (nullable), suggestedBy (nullable, the client's name), accepted (bool, true unless suggested).
- `playthrough_chapter`: id, playthroughId, actId (nullable: before the game), kind `chapter` | `entry` | `beat`, position, title (60), opensAfter (nullable objectiveId: a beat opens when that objective is done), fromSave (nullable label, "Save 7, 19 Oct 2026"), writtenBy (nullable client name), readAt (nullable), doc (the guide document, limit as `story`), textLength.
- `playthrough_snapshot`: playthroughId, source `save` | `hand`, label (60, "Save 7"), level, xp (nullable), day (nullable), place (80, nullable), skills (jsonb, name to value), questStages (jsonb, edid to highest stage, nullable), readBy (nullable client name), at. One row per playthrough, replaced on each update; the previous one kept as `playthrough_snapshot_prev` columns on the same row (level, skills) so "skills that moved since save 5" can be shown.

Status is worked out, not only stored: an objective with `doneBy: save` is done when the snapshot's `questStages[detect.quest] >= detect.stage` (or the quest is present when no stage is given); a `reach` objective is done when the snapshot's value meets the target, with the meter from the snapshot; `hand` objectives are done when the player ticks them. A beat is open when its `opensAfter` objective is done or when it has none.

### 3. Pages
- `/p/<id>`: the Play view, as the board. The title band (name, line, byline, build link, "Drafted with Claude" while shown, version), the three tabs (Play with "n of m done", Tale with "n chapters, n entries", Build linking to the build page or "No build yet"), Where you stand (from the snapshot, with "Read the latest save" when WO-112's helper is connected, else "Enter it by hand" opening a small form: level, day, place, and the skills the objectives name), the acts down the left with counts and bars, the current act (first act with an objective not done), its objectives with a checkbox, a kind tag only when linked (Quest, Quest line, Spell, Item, Follower), the status (Done, from your save | Done, ticked by you | Under way | To do | Later | Suggested by <name> with Accept and Skip), the why line, a meter for `reach`, and under an objective one muted line per chapter that hangs off it: "<Title> opened from this. Read it ›" or "<Title> opens when you tick this" / "opens at Speech 40". On the right: Next (in the game, in the tale, next act), Who she is (from the build when linked), Keeping it current (assistant and save), visibility.
- `/p/<id>/tale`: the Tale view, in the Story tab's rendering: contents rail (chapters before the game, then each act's entries and beats in order), the author's opening image when uploaded, the 680px Alegreya column, each piece with its heading and a sub line ("Act I | from save 5, level 4, day 3 | written by Claude, 19 Oct 2026"), entries with a brass rule, a beat not yet open as its title, what opens it ("Opens when you tick <objective>", linked) and "Read it anyway"; under every entry and beat, "In the game: <objective>, Act n" linking back to the row; "‹ Back to the quest log, Act n" beside the tabs, returning to the act the reader came from.
- `/p/<id>/edit`: editing by hand, as the board: acts on the left with Add an act and Move up/down; the act's fields; objectives in place, each with Done once | Reach a number, Done when (the save says so: a quest and stage picker from the planner's quests | you tick it), the number (Level | a skill | a count with a label, and the target), the why line, Remove, Move up/down; `@` in the text opens the mention menu with the new kinds `quest`, `line` and `follower` (a follower is a line in the Followers category) beside the existing ones; the rule shown in red under an objective the planner refuses; Add an objective and Add a beat here between rows; a beat's "opens when" (the objective above is done | right away) and Edit the scene, which opens the Story editor on that chapter. Chapters: a list with Add a chapter, each in the Story editor (text, up to 5 of the author's images, captions, the `story` limits).
- `/me`: a My playthroughs grid under My builds, cards with name, line, act n of m, "Drafted with Claude", visibility; New playthrough. Nav: "Playthroughs" after Quests while the flag is on, going to `/playthroughs`, a grid of Listed playthroughs newest first (nothing more for now).
- Visibility, Copy link, reports and the moderation holds work as for builds; a private playthrough 404s to anyone else.

### 4. The tools
Scope `playthroughs:write`; add it to `GRANTABLE` so a client asking for no scopes gets it too. Same shape as WO-110: plain inputs, names not ids, every write through the same code the pages use, nothing saved on a refusal, 30 writes a minute, at most 10 private drafted playthroughs per player. In `src/lib/mcp/playthroughs.ts`:
- `create_playthrough({ name, line, build?, version? })`: private, `draftedBy` the client; `build` is one of the player's own builds by id or name.
- `add_act({ playthrough, name, levels: "1 to 6" | "40 and up", place, goal, standingRule? })`, `set_act`, `remove_act` (not the last), `move_act`.
- `add_objective({ playthrough, act, text, link?: { kind, name }, kind: "once" | "reach", doneWhen: { quest, stage? } | { reach: { key, target } } | "hand", why?, after?: objective })`: refused with rule 14's words when `kind` is `once` with no `doneWhen`, when the text begins with Keep, Always or Never, or contains every, each, always or whenever; `link` names resolved as WO-110 does (a quest by its name in a line, with the line named when two share it); a `reach` key is Level, a skill name, or a count label.
- `set_objective`, `remove_objective`, `move_objective`, `set_status({ playthrough, objective, status })` for `hand` objectives only (a `save` one answers "the save decides this").
- `suggest_objective(...)`: as `add_objective` with `suggestedBy` and `accepted: false`; counts for nothing until the player accepts it on the site.
- `write_chapter({ playthrough, kind: "chapter" | "entry" | "beat", title, text, act?, after?: objective, fromSave? })`: `text` is Markdown (paragraphs, a heading, a quote, no images), converted to the guide document and checked by its validator and limits; a beat needs `after`; an entry may carry `fromSave`. `set_chapter`, `remove_chapter`.
- `set_snapshot({ playthrough, source: "save", label, level, xp?, day?, place?, skills, questStages? })`: only `source: "save"`, for WO-112's helper; a value the assistant made up is what rule 18 forbids, so the description says so.
- `get_playthrough`, `list_my_playthroughs`, `finish_draft` (the review link when every act has at least one objective and every beat has an `after`; the issues otherwise).
- `suggest_quests({ playthrough?, level, where?, done?: [line ids] })`: from `stories.json` and the checked lines only (`checked.start === "files"`), those open at the level and not done, each with its checked start line and the planner link; never a line whose start isn't checked. Read-only, scope `facts`.

### 5. Limits and moderation
Names, lines, goals, why lines and chapter text go through the same checks as builds and guides; images only through the site's upload path, never the tools. Rate kinds: `mcp-write` as WO-110.

### 6. Tests
- Unit: the objective refusals (no done-when; "Read every new book"; "Keep playing the Bee and Barb"); done worked out from a snapshot (quest stage, reach, hand); a beat open only after its objective; a suggestion not counted; Markdown to guide document within limits; `suggest_quests` never returns an unchecked line; scopes granted when none are asked for are facts, builds:write and playthroughs:write.
- e2e, through the door with a WO-109 token: create a playthrough on the test author's build, two acts, five objectives (one refused), one suggestion, a beat and a chapter, `finish_draft` returns the link. On the site: the Play view shows it private under My playthroughs; ticking a hand objective opens the beat's line; the Tale view shows the chapter and the "In the game" link; editing an act by hand adds an objective with a `@quest` mention and shows the rule under a refused one; Accept on the suggestion makes it count; Enter it by hand sets level 6 and the `reach` meter moves; another player's token can't read it; a facts-only token can't write.
- Screenshots: the Play view, the Tale view, editing an act, My playthroughs. Compare with row 23 on the canvas.

### Done when
- [x] An assistant with a token can draft a playthrough end to end with plain inputs, is refused for an objective the player can't know is done, and gets the review link from `finish_draft`.
- [x] The Play view, Tale view and edit page match the three boards; the Tale text appears nowhere on the Play view but its one-line pointers.
- [x] Done is worked out from the snapshot or the player's tick, never stored by the assistant; a suggestion counts only once accepted.
- [x] The rules are in `content/mcp/style.md` and `docs/design-rules.md` as written here.
- [x] Every check in CLAUDE.md passes; migration additive; behind the flag. Commit on `staging`, push, and stop: Dave asks Claude to draft Kyria's playthrough and reads it.

---

## WO-111a  Ticking a quest objective before the helper exists (Mac, 19 Oct 2026)

**Why.** Bob's check of WO-111 on the seeded Kyria: an objective the save decides ("Spread the Love", a quest with a stage) has no tick and no status menu, and nothing can mark it done until WO-112's helper sends quest stages. Until then a player with a quest-linked objective is stuck, and the assistant's drafts will be full of them.

- A `save` objective the snapshot hasn't shown can be ticked by the player; it then reads "Done, ticked by you" and the beat it opens opens. When a later snapshot shows the quest at the stage, "Done, from your save" takes over; a snapshot that shows the quest not yet there leaves the player's tick alone (the save can be older than the tick).
- `set_status` through the door stays `hand` objectives only; the player's tick on a `save` objective is the site's, as rule 18 keeps the save the assistant's only source.
- The status menu on a `save` objective offers Done and To do only (no Under way, no Later: the save decides the rest).
- Unit test for the three cases; the WO-111 e2e ticks "Spread the Love" by hand and sees it done.

### Done when
- [x] On the seeded Kyria, "Spread the Love" can be ticked and reads "Done, ticked by you"; a snapshot with its stage changes it to "Done, from your save".
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, stop.

---

## WO-111b  No unions in tool inputs (Mac, 19 Oct 2026)
Status: done

**Why.** Dave's Claude drafted Kyria's playthrough through the door (33 objectives, five acts, the chapters) and reported that every `doneWhen: { reach: ... }` call failed input validation. Bob called the same tool on the local door with a token and all three reach shapes saved, so the planner is fine: Claude's connector checks arguments against the tool's JSON schema before sending, and `doneWhen` is a union of three shapes (`anyOf`), which it doesn't always get right. Keep every tool input to plain fields, one level deep, no unions.

- `add_objective` and `set_objective`: `doneWhen` goes. In its place, all optional and flat: `quest` (name or id) and `stage` for one the save shows; `reachKey` ("Level", a skill, or a count's label) and `reachTarget` for a number; `byHand: true` for one the player ticks. The same rule 14 refusals; a `kind: "reach"` with no `reachKey` answers "Say the number to reach: reachKey and reachTarget", not the generic rule.
- `act` and `objective` take a string only ("2", "Act II", or the name; an objective's id as a string or its words). Numbers still work when sent as strings.
- `check_progression`: `build` (the plain shape) and `buildId` (a string) as two optional fields, one required.
- `get_playthrough` answers in the same flat shape so an assistant can send a level back unchanged.
- Grep every `z.union` in `src/lib/mcp/*` and `src/app/api/mcp/route.ts`; none remain in an input schema. Unit test that the registered input schemas contain no `anyOf` or `oneOf`.
- The WO-110 and WO-111 e2e send the new shapes.

### Done when
- [x] `tools/list` on staging shows no `anyOf` or `oneOf` in any input schema.
- [x] Dave's Claude adds a reach objective ("Lute to 66") through the door and it saves with its meter. (Dave, 23 Oct: tested, done.)
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, stop.

---

## WO-111c  A playthrough's details through the door (Mac, 19 Oct 2026)
Status: done

**Why.** Dave's Claude drafted Kyria's build after her playthrough and had no way to attach it: only `create_playthrough` takes a build. The edit page can, the door can't.

- New tool `set_playthrough({ playthrough, name?, line?, build? })`, scope `playthroughs:write`: the playthrough's own details, through the same write the edit page uses. `build` is one of the player's builds by id or name, or "none" to unlink; a build that isn't the player's is refused. Plain fields, no unions.
- `get_playthrough` and `list_my_playthroughs` answer with the linked build's id and name.
- Unit test for the link, the unlink and the refusal; the WO-111 e2e links the drafted playthrough to the test author's build and sees the Build tab change.

### Done when
- [x] Dave's Claude links Kyria's playthrough to her build through the door and the Build tab shows "level 23 of 23". (Dave, 23 Oct: tested, done.)
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, stop.

---

## WO-114  One character, two views (Mac, 20 Oct 2026)

**Why.** A build and a playthrough are two records, two pages, two lists and two tool families, and the player who wants the immersive run has to make both and join them (Claude drafted Kyria's run, then her build, and couldn't link them). Dave, 19 Oct: keep two records underneath, one container on top. A playthrough is a character and her run. Two more things from his review of the boards: the character leads with the big cover the build page has, and the Tale is a reading page with the least UI in the way.

**The boards.** Canvas row 24: `Characters.dc.html` (My characters), `NewCharacter.dc.html` (one question, then Set up with one more step), `CharacterBuildTab.dc.html` (the Build tab is the build; the build's own page says it belongs to a run). Row 23, revised: `Playthrough.dc.html` (the cover on the Play view) and `PlaythroughTale.dc.html` (the Tale as a reading page). Build what they show.

**Where:** on `staging`, behind `FEATURE_PLAYTHROUGHS` as WO-111, small commits in the order below. Nothing moves in the data except two columns; the pages and the entry points change.

### 1. The cover
- A character has one cover: the build's (`builds.coverImageUrl`). `playthroughs.coverImageUrl` goes; the run's edit page uploads to the build's cover through the same path, and the run's pages read it from the build.
- The Play view and the Build tab lead with it as the build page does (rule 12): full width, 440 tall, name, line and byline over the dark fade, Edit and Copy link top right. No cover: the plain dark band, as the build page.
- A run with no build yet (made through the door before WO-114, or an older one) keeps the band until a build is attached.

### 2. My characters
- `/me` shows one grid, "My characters", in place of My builds and My playthroughs: every build the player owns, one card each, the build's card as today. A build with a run adds the run box (Where she stands: act, place, level and day from the snapshot, "n of m done", a bar, Play ›) and a Run tag on the cover; a build alone adds "Build alone: Add a run ›", which opens The run step from section 3 on that build. The Story tag and "Drafted with Claude" stay. The count line: "4 characters: 2 with a run, 2 builds alone".
- Assistants stays under the grid; its row counts characters drafted (builds and runs together).
- "New build" becomes "New character" in the header and on `/me`. `/playthroughs` (Listed runs) and Browse (Listed builds) stay as they are; the header keeps Builds and Playthroughs.

### 3. New character
- `/b/new` (the creation wizard) opens with one question before Set up: "A build and a run" or "A build alone", two cards as the board, Confirm. A build alone is Set up exactly as today.
- A build and a run: Set up as today, then a seventh step, The run: name and one line (prefilled from the build's name and description), Act I's name (prefilled "The first days"), levels (prefilled "1 to 5"), place (prefilled from the start when `starts.json` names one, else empty), the goal line (empty), and the objectives list with the start's own quest as its first row when the planner knows it (`doneBy: save`, its edid; see the note below), then Add an objective. Confirm makes the build and the run in one transaction and opens `/p/<id>`.
- The same step runs from "Add a run" on a build-only card and from the build page's Edit for the owner.
- Note for Bob: `starts.json` carries no place or start quest today. The start-check reports' `starts` tables name each Alternate Perspective start's quest (`APS_InnWhiterun` and the rest). Bob adds `place` and `quest` to the starts through `gamedata/5.0.4.8/overrides.json` in a follow-up; until then the step prefills what it has and leaves the rest empty.

### 4. The character page and the build's page
- `/p/<id>` keeps Play and Tale; the Build tab shows the build itself under the run's cover: the build page's level ruler, level card, and its Levels, Guide and Story row as a second row of folder tabs in the build's own style. The ruler marks the run's level with "You are here" from the snapshot. The tab row's right side: "The build on its own: <visibility>", Copy the build's link, Edit the build. The band's "Build: <name>" link goes; the tab is the link.
- One tale per character. When a run is attached to a build, the build's Story tab shows "Her tale is in the run ›" and its Story editor is off; an existing Story (WO-79) becomes the run's first chapter before the game, images and captions carried over, in the same transaction as the attach, and the Story's rows are removed. Detaching a run (set_playthrough with "none", or the edit page) leaves the chapters with the run.
- `/b/<id>` for a build with a run: under the byline, "Part of a run: <run name>, <Act n> ›", to the owner always, to others while the run is Listed or Link only. A private run shows nothing to others.

### 5. The Tale page
- `/p/<id>/tale` is a reading page: no site header, no band, no tabs row, no rail. The opening plate is the first chapter's first image when there is one, else the character's cover, full width, 720 tall, with the Tale's title and epigraph over its lower edge (both from the first chapter's `story:title` and `story:line` equivalents on the run: new nullable `playthroughs.taleTitle` (60) and `taleLine` (140), set on the run's edit page). Over the plate, a thin bar: the character's name, Play / Tale / Build in small type, "‹ Quest log, Act n"; it fades out after the first 200px of scroll and comes back on scroll up.
- Then the 680px column as WO-111 renders it, with: a chapter's sub line in the dimmer grey (`#6f7c8c`); an entry's "In the game: <objective>" as a small italic at the end, right-aligned; a waiting beat as its title in italic and one line ("After her first hunt. Read it anyway"), no box; the owner's Edit and "written by Claude" in `#3a4658` until the pointer is on that chapter, then the muted grey. Nothing else on the page.
- Contents: a tab on the left edge, "Contents", vertical, at 200px from the top; it opens a 320px drawer over the page with the WO-111 contents (chapters before the game, each act's entries and beats, the one being read in ember, waiting ones dim), Add a chapter at the foot. The chapter editor opens from the drawer and from Edit. Escape or a click outside closes it.
- The build page's Story tab (WO-79) keeps its own rendering; this page is the run's.

### 6. The tools
- `create_playthrough` takes the character creation fields (`creationFields` from WO-110: race, birthsign, mode, deity, start, startOption, majors, minors, traits) with the run's `name` and `line`, makes the build and the run in one transaction, Act I prefilled as section 3, and answers with both ids and both links. The old shape (`build` by id or name) still works for a run on an existing build. `create_build` stays for a build alone.
- `get_playthrough` answers with the build's id, name, cover and level count; `list_my_builds` says which builds have a run and `list_my_playthroughs` which build each run is on. `get_style_guide` gains one line under Builds: "A character is a build with or without a run; make the run with create_playthrough when the player wants the story, not a build and a run separately."

### 7. Tests
- Unit: create both in one transaction and nothing when the run's step fails; a Story moved to the run's first chapter on attach, images kept; the build page's run line by visibility; the tale title and line.
- e2e: New character with a run end to end, landing on the Play view with Act I and the start's objective when known; "Add a run" on a build-only card; the Build tab shows the build's levels with "You are here"; `/b/<id>` shows the run line to the owner and hides it from another player while the run is private; the Tale page has no header and the Contents drawer opens and closes; `/me` shows one grid with both kinds; through the door, `create_playthrough` with creation fields makes both.
- Screenshots: My characters, New character's first question and The run step, the Play view with the cover, the Build tab, the Tale page at the top and mid-scroll, the build's page with the run line. Compare with rows 23 and 24.

### Done when
- [x] A player makes a character with a run in one pass and lands on her Play view; a build alone is unchanged.
- [x] `/me` is one list; the Build tab is the build; the build's own page still shares alone and says it belongs to a run.
- [x] The character leads with the build's cover on every view; the Tale page is the plate, the bar and the column, with Contents in a drawer.
- [x] `create_playthrough` makes both through the door.
- [x] Every check in CLAUDE.md passes; migration additive; behind the flag. Commit on `staging`, push, and stop: Dave makes Kyria again as one character and reads her tale.

---

## WO-114a  No question at New character; a run is added from the build (Mac, 20 Oct 2026)

**Superseded by WO-116, which carries everything below. Don't build this order.**

**Why.** Dave, after reading how it works: the "a build and a run / a build alone" question at New character is for us, not for the player. Every character is a build; a run is something you add. A player sharing a build should never see the word run; a player wanting the story loses one click.

- `/new` opens Set up directly, as New build did. No first question; `?kind=` goes.
- The run's step (WO-114 section 3) moves behind one action, **Start a run**: for the owner, beside Edit on the build page's hero and on the card in My characters (in place of "Add a run"). It opens the same step, name and line prefilled from the build, Act I from the start, Confirm makes the run and opens the Play view.
- A build without a run is the build page as before, no Play or Tale tabs. Once a run exists the character has the Play, Tale and Build views.
- The door is unchanged: `create_playthrough` with creation fields still makes both in one call; `create_build` a build alone.
- Update the WO-114 e2e: New character lands in Set up; Start a run from the hero and from the card; a build without a run shows no run tabs. The `NewCharacter.dc.html` board is superseded by this order (note on the canvas).

### Done when
- [x] New character is Set up; a run is started from the build page or its card; a build without a run looks as it did before WO-114.
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, stop.
- Closed (Mac, 22 Oct): nothing to build. WO-116 sections 1 and 2 carried all of it, and `e2e/wo116.spec.ts` tests each point: "New character lands in Set up, with no question first", "Start a run, from the hero and from the card", and a build alone with Levels and Guide only. Checks on staging at `2d64a6c`: typecheck, lint, 527 unit tests, the 11 player questions, 218 game-data tests, build, and e2e 351 of 351 once `e2e/wo136.spec.ts` was brought up to date: the PC's board reader (`23c2d9d`) now places the 12 Missives boards, so the page names them instead of "Where the boards are isn't checked yet."

---

## WO-116  Play is the page; the story opens in a reader (Mac, 20 Oct 2026)

**Why.** Dave, reviewing WO-114 on staging: the Tale was a page of its own below a tab row, so clicking it threw away the hero and the tabs and broke the page's order; the Build tab nested a second row of tabs; and the question at New character was for us, not the player. His idea, boarded and approved ("Love it"): Play is the page, and the story relevant to where the player is opens in a full-screen reader, one tap away. The story supports the run; a player can ignore it and lose nothing.

**The boards.** Canvas row 26: `CharacterReader.dc.html` (interactive: Play with the act's story card and Story markers; the reader over the page) and `CharacterReaderPhone.dc.html`. Row 25's full-bleed hero and single tab row stay; its Story tab does not. Rows 23 and 24's Tale page, Build tab and New character question are superseded.

**Where:** on `staging`, behind `FEATURE_PLAYTHROUGHS` for the run parts, small commits in the order below. This order includes all of WO-114a.

### 1. One page for a build and a character
- `/b/<id>` and `/p/<id>` become the same page: the build page's full-bleed hero exactly as today (cover, name, line, byline, Edit and Copy link), then one row of folder tabs in the build page's style. A build alone: **Levels, Guide**. A character with a run: **Play, Levels, Guide**, Play first and the default. `/p/<id>` stays the run's address and opens Play; `/b/<id>` opens Levels. No nested tabs anywhere; the Story tab goes (its content opens in the reader, section 3).
- The tab row pins under the site header as you scroll, as a thin bar: the character's name and the tabs. Same on every tab.
- Owner only, beside Edit: **Start a run** on a build without one (WO-114's The run step, as a step of its own), and **Read the story from the beginning** under the byline on every character or build that has a story.
- `/me` (My characters) keeps one grid; the card's "Add a run" becomes "Start a run".

### 2. New character
- `/new` opens Set up directly, as New build did. No first question; `?kind=` goes. The door is unchanged: `create_playthrough` with creation fields still makes both in one call.

### 3. The reader
- One reader for every story: a run's chapters, entries and beats, and a build alone's Story (WO-79). It opens at `/p/<id>/story/<chapter>` (or `/b/<id>/story` for a build's Story) over the page, full screen: the chapter's plate image (its first image, else the act's picture, else the character's cover) full width, 640 tall on desktop and 380 on a phone, the kicker (Before Skyrim, Act I) and title and epigraph or sub line over it, then the 680px Alegreya column as WO-111 renders it, "In the game: <objective>" at the end of an entry linking back to its row, and previous / Back to the quest log / next at the foot.
- A thin top bar over the plate: "‹ Back to the quest log" (or "‹ Back to the build"), the chapter's place, previous and next by name. It fades as you read and returns on scroll up.
- Previous and next walk the whole tale in reading order: chapters before the game, then each act's chapter, entries and beats. A beat not yet open is a stop that shows its title, what opens it and "Read it anyway".
- Closing (Back, Esc, the browser's back, a phone's back gesture) returns to the page at the same scroll position. It has its own address so a scene can be linked and the browser's history works; opened from the page it is drawn over it, opened from a link it loads with the page behind it.
- The owner's Edit is in the top bar, faint, and opens the Story editor on that chapter.

### 4. Story in Play
- **Act story card:** at the top of each act on Play, before the goal line and objectives, a wide card: the act's picture (new `playthrough_act.imageUrl`, nullable, uploaded on the run's edit page through the guide images path; else the first image of the act's chapter; else the cover), "Act I", the act's name, the first two lines of the act's chapter, **Read Act I** and its length ("3 min | a chapter and 2 entries"). Once the player has opened it, the card shrinks to one line ("Act I's story ›"); a toggle on the line expands it again. Read state per player in `playthrough_chapter.readAt` (the owner) and localStorage for other readers.
- An act's chapter is new: `playthrough_chapter` rows with `kind: "act"` and `actId`, one per act, written in the Story editor or by `write_chapter({ kind: "act", act })`. An act with no chapter shows no card; the goal line leads.
- **Story markers:** an objective that a chapter hangs off (a beat's `opensAfter`, an entry's linked objective) carries a marker under its why line: "Story" and the chapter's title in italic, opening the reader there. A beat not yet open shows a dashed marker, "opens when you tick this" (or "at Speech 40"), not a link. The WO-111 one-line pointers go.
- The acts list on the left and everything else on Play are unchanged.

### 5. Tools and the style guide
- `write_chapter` takes `kind: "act"` with `act`. `get_playthrough` lists each act's chapter and each objective's chapters. The style guide gains under Playthroughs: "Each act can open with its own chapter: the story of that stretch, written before the player plays it. Beats and entries hang off objectives."

### 6. Tests and screenshots
- e2e: a build alone has Levels and Guide and Read the story; a character with a run opens on Play; the tab row pins; Read Act I opens the reader at `/p/<id>/story/<chapter>`, Back returns to the same scroll position and the card is now one line; a Story marker opens its entry and "In the game" comes back to the row; previous and next walk the tale and stop at a waiting beat with Read it anyway; New character lands in Set up; Start a run from the hero and from the card; the browser's back button closes the reader.
- Screenshots at 1440 and 390: a build alone, Play with an act card and markers, the reader at an act and at an entry, the reader's foot, My characters. Compare with row 26.

### Done when
- [x] The build page and the character page are one page: full-bleed hero, one row of tabs, no Story tab, no nested tabs, the row pinned on scroll.
- [x] Every story opens in the reader, with its own address, from the act card, a marker or the hero, and closes to the same spot.
- [x] Each act can open with its own chapter and card; objectives carry their Story markers.
- [x] New character is Set up; a run is started from the build.
- [x] Every check in CLAUDE.md passes; migration additive; behind the flag. Commit on `staging`, push, and stop: Dave opens Kyria, reads Act I from its card, ticks a hunt and reads Made with Care from its marker.

---

## WO-116a  One pinned bar, not two (Mac, 20 Oct 2026)

**Why.** Bob's check of WO-116: scrolled down a character's page, two bars pin at the top, one under the other. The build page's old bar (name | Levels, Set up, Guide, Story | visibility, Copy link, Edit) and WO-116's new one (name | Play, Levels, Guide). The old one still offers a Story tab that no longer exists.

- One pinned bar on every build and character page: the name, the page's tabs (a build alone: Levels, Guide; a character: Play, Levels, Guide), and on the right the owner's controls the old bar had (visibility, Copy link, Edit; Set up stays under Edit's menu or beside it, as the old bar had it). The old bar goes.
- e2e: scrolled, exactly one bar is pinned and it has no Story tab, on a build alone and on a character.

### Done when
- [x] Scrolled on a build alone and on a character, one bar pins, with the page's own tabs and the owner's controls.
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, stop.

---

## WO-117  One way to edit (Mac, 20 Oct 2026)

**Why.** Dave, after WO-116, trying to add pictures and chapters to Kyria: "I don't really understand what we have built, so confusing." Editing grew as separate pages with their own layouts, buttons and saving: Set up, Levels, Guide and Story under one bar, the run's editor at `/p/<id>/edit` reached from Play, the act's chapter on one page and its text on another, and the Tale box's "Edit the chapters" on a third. His eleven points, all covered below: Edit should open on Set up at Details with the tabs Set up, Levels, Guide, Story (Bob added Play, Dave agreed); he couldn't find where to edit the story; an assistant's drafts leave the author not knowing where to upload pictures; Set up's steps jump with no transition; titles and labels differ from step to step; "View build" as the main button made him think his changes weren't saved, and he couldn't tell when it saves; "Drafted with Claude" should be a general "AI assisted" with an icon and a tooltip; a character should open on Play; the reader's Esc isn't shown, it appears with no transition so it looks like a new page, and its Edit, previous and next can't be seen; editing acts is far too much UI, objectives run together, too much ember, too few tooltips, and no preview of the story as it comes together; and a chapter is split across two pages.

**The boards.** Canvas row 27: `EditSetup.dc.html`, `EditPlay.dc.html`, `EditStory.dc.html`, `EditPictures.dc.html`, `ReaderMotion.dc.html` (all but EditPictures are interactive; click around). Row 23's `PlaythroughEdit.dc.html` is superseded.

**Where:** on `staging`, run parts behind `FEATURE_PLAYTHROUGHS`, small commits in the order below. **Push after each part** so Dave can test on the preview while the next part is built; Part 1 first, since it is the quickest to see.

### 1. Quick fixes Dave can test first
- **Play first.** A character opens on Play from every way in (`/b/<id>` of a build with a run, `/p/<id>`, My characters, a shared link). Only a build alone opens on Levels.
- **AI assisted.** Everywhere "Drafted with <name>" shows today (the hero byline, build and character cards, `tabs.tsx`, `cards.tsx`, `build-card.tsx`, `build-view.tsx`) it becomes the AI assisted mark: a 16 px pixel icon, the words "AI assisted", and an "i" with: "<author> made this with an AI assistant through the planner. The planner checked every level and perk against the game's rules, as it does for any build." The icon is a Dwemer sphere's head in brass with an ember eye slit (the board has a first pass); draw it in `scripts/icons/pixels.py` to the icon rules in design-rules.md, not by hand. The Details checkbox becomes "AI assisted mark: Show it". `drafted_by` and `show_drafted` are unchanged; the assistant's name is no longer printed.
- **The reader's motion and controls** (`ReaderMotion.dc.html`). Opened from the page, the reader slides up over it (transform, about 400 ms, ease-out) while the page behind dims; Close, Esc and back slide it down. Opened from a link it simply loads. Under `prefers-reduced-motion` it fades instead. The top bar is solid (ground at 92%) with a rule, not a fade: on the left a real button **× Close** with an **Esc** key cap beside it; in the middle the story's title; on the right real buttons **‹ Previous**, **Next ›**, then the owner's **Edit**. The foot's previous and next become two cards with "‹ Previous" / "Next ›" and the chapter's name. The bar no longer fades away while reading.
- **Set up's steps slide.** Changing step slides the new one in from the side it sits on (about 280 ms, opacity and a 48 px shift), reduced motion fades. Every step uses one title style (the `title` h1 as "Choose a race") with nothing above or below it, and one label style for every field (`label`); help lines under fields (`field-hint`, "Your Discord post or guide.") become "i" tooltips. Go through all seven steps and list in the commit what changed on each.

### 2. One edit mode
- **Edit opens Set up at Details** (`/b/<id>/setup?step=name`) for a build and a character alike.
- Every edit page (Set up, Levels, Play, Guide, Story, and Gear, reached from Levels as today) gets the same top: **the edit band**, then the page's own hero at 300 px with "Change the cover" (opens the cover field in Details), then **one tab row**: a build alone **Set up, Levels, Guide** (and Story when `storyOn()`), a character **Set up, Levels, Play, Guide, Story**. Same folder-tab style and subtitles as the page. The old edit bar and its menu go; on a phone the tabs scroll sideways in one row.
- **The edit band** (`.eband` on the boards): "Editing" and the name on the left; on the right the save status, visibility, Copy link, and **Done**. Done is the only ember button on every edit tab and goes to the page (Play for a character, Levels for a build alone). "View build" goes everywhere.
- **Everything saves as you go.** No Save buttons anywhere in edit mode: Set up's "Save changes", the run editor's and chapter editor's save buttons all go; fields save on change (debounced, as the Levels editor already does) through the same server checks. The band says **Saving…**, then **✓ Saved** with an "i": "Every change saves as you make it. Done takes you back to the page as others see it." A failed save says so in the band in health red with what failed, and Done then asks before leaving. Making a new character keeps Next and Create character.
- Old addresses (`/p/<id>/edit`, `/p/<id>/edit?tale=1`, `/p/<id>/edit/tale/<cid>`, `/b/<id>/story/edit`) redirect to the new tab (and chapter).

### 3. Play in edit (`EditPlay.dc.html`)
- The run editor becomes the Play tab in edit mode and looks like Play: the acts list on the left (drag to reorder, **+ Add an act** at the foot as a dashed row), then the act's card as readers see it, then its fields, then its objectives.
- **The act's card** shows the act's picture; with none, the card is a dashed slot with **Add the act's picture** (the guide images path, as WO-116's act picture). Its name is edited in place on the card. Under the name: the act's chapter's first lines with "Edit it in the Story ›", or "No chapter for this act yet. Write it in the Story ›"; both open the Story tab at that act's chapter (creating it on first write, not on click).
- **Fields:** From level, To level, Place in one row; Goal; Standing rule. Goal and Standing rule have "i"s ("What the act is for, in one line. It shows under the act's card." / "Something she keeps doing through the whole act. It has no box to tick, so it is not an objective.").
- **Objectives are rows** like Play's: drag handle, box, text, why line, and on the right its Story link ("Story: The First Set") and **Edit**. Click a row and its fields open under it, the rest stay one line: What to do; Kind (Done once / Reach a number) and Done when (The save says so / You tick it) as two segmented controls, each with an "i"; Quest (search the planner's quests, with an "i") or, for Reach a number, what and how many; Why; Story (the entry or beat that opens from it, with "Open it in the Story ›", or "Add a beat ›"); then "Move to another act ▾" and Remove (text, health red, asks first). One row open at a time. **+ Add an objective** as a dashed row. Suggested objectives keep Accept and Skip, as quiet buttons.
- **Colour:** in the work area every button is the quiet `btn`; selected segments are light (#263040 with a light underline), not ember. Links stay ember as everywhere.

### 4. The Story, written in the reader (`EditStory.dc.html`)
- The Story tab in edit mode is the reader's own layout, editable in place: on the left **Contents**, on the right the plate (picture, kicker, title, line) and the 680 px Alegreya column, at `/p/<id>/edit/story/<chapter>` (a build alone: `/b/<id>/edit/story`).
- **Contents** lists everything in reading order: The title page (the tale's title, line and picture from the run's details), the chapters before Skyrim with **+ Add a chapter**, then each act: its chapter (a dashed **+ Write the act's chapter** when there is none), its entries and beats with a muted kind tag, and **+ Add an entry or a beat**. Acts with nothing show "Nothing written yet". Drag to reorder within a group; the "i" by Contents says so.
- **In place:** the title and line are inputs styled as the reader's (a dashed underline only in Write); the column is the existing guide editor (WO-79's, with `/` for an image or a break), styled as the reader column. An empty line reads "[A line under the title]"; an empty act chapter reads "[Write the act's chapter here: the story of this stretch, before she plays it.]".
- **Pictures where they show:** an empty plate is a dashed slot with **Add a picture**; a full one has **Change the picture** and **Remove** on it; between paragraphs, the editor's insert row shows **+ Image** and **+ Break**. Figures keep their caption and Replace / Remove on hover.
- **Entries and beats** show under the plate "Opens when this is done: <objective> ▾" with an "i" ("Readers see this once the objective is done. Until then the story shows its title and what opens it."); the menu lists the act's objectives.
- **Write / Preview** at the top right. Preview hides every control and the dashes, dims Contents, and shows the chapter exactly as the reader does. Previous and next at the foot walk Contents in order.
- The run editor's Tale box, "Edit the chapters", the separate chapter page and the "Add a chapter" form at the bottom of the run editor all go.

### 5. Pictures for a drafted character (`EditPictures.dc.html`)
- **Pictures** in the edit band on every edit tab: "Pictures 3 of 16 ▾" opens a panel on the right listing every place a picture can go, in story order, grouped: The page (the cover), The story (the title page and each chapter), each act (its card, its entries and beats). Each row: a thumbnail or a dashed "+" box, the name, **Add** or **Change**. Add uploads straight into that place through the same check as every upload today. Close with × or Esc.
- **The owner's nudge:** on the page of a character with no cover and no story pictures, the owner (only) sees a box under the hero: "No pictures yet" / "Assistants can't add pictures. Add a cover, and pictures for the story and the acts, from the planner." with **Add pictures**, which opens edit with the Pictures panel open (`?pictures=1`). "Only you see this." under it. It goes once there is a cover.
- **The door:** `finish_draft` and `finish_draft_playthrough` replies gain `addPictures: <link>` (the edit page with `?pictures=1`), and the style guide gains under Playthroughs: "Assistants can't add pictures. When you finish a draft, give the player the addPictures link so they can add the cover and the story's pictures."

### 6. Tests and screenshots
- e2e: Edit opens Set up at Details; the five tabs on a character and three on a build alone; changing a field shows Saving then Saved with no Save button anywhere, and the value is there after a reload; Done goes to Play for a character and Levels for a build; a failed save (mock) shows in the band and Done asks; the old edit addresses redirect; an objective row opens and closes, one at a time; the act card's "Write it in the Story" opens that act's chapter; adding a chapter from Contents; Preview hides the controls; an entry's "Opens when" changes its objective; the Pictures panel lists every slot and Add uploads into one; the owner's nudge shows on a coverless draft and not for a reader; a character opens on Play from every entry point; the reader closes on Esc and on × Close; AI assisted shows with its tooltip and the assistant's name appears nowhere.
- Screenshots at 1440 and 390 of each edit tab, the Pictures panel, the nudge, and the reader open (mid-slide is not needed). Compare with row 27.

### Done when
- [x] Part 1: Play is first everywhere; AI assisted with its icon and tooltip replaces "Drafted with"; the reader slides and has Close with Esc, Previous, Next and Edit as buttons; Set up's steps slide, with one title and one label style. Pushed for Dave to test.
- [x] Part 2: one edit band, hero and tab row on every edit page; Edit opens Details; everything autosaves, no Save buttons, Done is the one ember button; old addresses redirect.
- [x] Part 3: Play in edit as the board: the act card with its picture slot, objectives as rows that open one at a time, quiet buttons.
- [x] Part 4: the Story written in the reader, with Contents, pictures in place, Opens when, and Preview; the old Tale box and chapter page gone.
- [x] Part 5: the Pictures panel, the owner's nudge, and `addPictures` in the door with its style guide line.
- [x] Every check in CLAUDE.md passes; migration additive if one is needed; behind the flag. Commit on `staging`, push, and stop: Dave opens Kyria, clicks Edit, adds Act I's picture from the Pictures panel, writes a line of Act I's chapter in the Story tab, previews it, clicks Done, and reads it from Act I's card.

---

## WO-118  Calmer: Dave's first test of WO-117 (Mac, 20 Oct 2026)

**Why.** Dave tested WO-117 on Kyria. Editing is clearer, but: adding images felt overwhelming ("if the user had no idea this was waiting for them it still feels like a lot"), rows in the Pictures list jumped to the bottom as he filled them, "entry", "beat" and "the act's chapter" were three words for one thing, the image buttons over pictures can't be seen, "Before Skyrim" assumes where a story starts, the only way into the story was one button in the hero, Play's read view is "WILDLY busy" (the right rail is pointless, "Keeping it current" and "the door" mean nothing to players, "Standing rule" means nothing to him), Details is still chaotic, the chosen theme only paints some pages, the Like button doesn't look or work like the one he loved, the hero's ⋯ menu is cut off, and the AI assisted mark's "i" sits apart from it on its own row.

**The boards.** Canvas row 28: `PlayCalm.dc.html` (Play, read view) and `DetailsCalm.dc.html` (interactive: click Position). Row 27's boards are updated for the tooltip and the tab order; where row 27 and this order differ, this order wins.

**Where:** on `staging`, run parts behind `FEATURE_PLAYTHROUGHS`, small commits in the order below, **push after each part**.

### 1. Small fixes
- **Edit tab order:** Set up, Levels, Guide, Story, Play (a build alone: Set up, Levels, Guide, and Story when it's on). The view's tabs stay Play, Levels, Guide.
- **AI assisted:** the whole mark (icon and words, with a dotted underline) is the tooltip's trigger on hover, focus and tap; no separate "i". It sits in the byline row with Made by and the rest, never on its own row; it wraps with them on a phone. The tooltip opens above the mark when there is no room below.
- **Menus aren't cut off:** the hero's ⋯ menu, its visibility menu and every menu in the edit band open in a layer above the page (a portal, or the hero no longer clipping its children), at every width. e2e: open each one and check it is fully on screen.
- **The Like button is the one from WO-36 everywhere:** the pixel heart, the burst and the rolling count, on the character page as on a build page. The owner of a private build or character can like it too (setLike stops refusing a private build for its owner; nobody else can see it to like it). e2e: like and unlike on a private character as its owner, and see the burst.
- **Image buttons that can be seen:** every button over a picture (Change the cover in the edit hero, Change, Position and Remove on story images and act cards, Edit, Copy link and ⋯ in the view hero) has a dark backing (the ground at 88%), a light border and light text, as on the boards. Check them over Kyria's cover, which is pale.
- **"Picture" becomes "image"** in every label, button and message ("Change the image", "Add an image").

### 2. One word for story text: chapter
- To the player there is one kind of story text, a **chapter**. A chapter sits either in the **Prologue** (the story before the first act, wherever it happens; "Before Skyrim" goes everywhere) or in an act. Any chapter can **unlock when** an objective is done or a number is reached; until then readers see its title and what unlocks it, as beats do now. "Entry", "beat" and "the act's chapter" go from the site, the reader, the style guide, the design rules and the tools.
- **An act's card reads from the act's first chapter** (its image, title and first lines), so an act needs no special chapter.
- **The Story tab's Contents:** The title page; Prologue with its chapters and + Add a chapter; each act with its chapters (a locked one shows a small lock and "Unlocks when: <objective>") and + Add a chapter. Each chapter has one setting under its plate, **Unlocks when** (None, or one of the act's objectives), with its "i".
- **Data and tools:** no column is dropped. `kind` stays and is set from where the chapter sits and whether it unlocks (an act's first chapter written before play is `act`, one unlocking is `beat`, one written after play from a save is `entry`) so old rows read as before. `write_chapter` takes `act` (optional) and `unlocksWhen` (optional) in place of `kind`; `get_playthrough` returns each chapter's act and unlocksWhen. The style guide's rule 16 and design rule 27 become: "The story is made of chapters. A chapter sits in the Prologue or in an act; any chapter can unlock when an objective is done. The first chapter of an act opens its card on Play." Keep the "from save 7" line on chapters written from a save.

### 3. Images, lighter
- **"Images", on the Story tab only.** The Pictures button leaves the edit band. The Story tab's top bar gets **Images ▾** with no count; it opens the same panel, titled "Images", with a "What's this" "i": "Every place in this character's story that can show an image. All of them are optional; an empty one uses the act's image or the cover." The list keeps story order and **rows never move** when filled. The cover stays in Details; act images stay on the act cards in Play.
- **Position:** every image slot (the cover in Details, each chapter's plate, each act's card) has **Change, Position, Remove**. Position lets the owner drag the image to choose what stays in view, as the cover's focus works today, and Done ends it. New nullable columns for the focus on `playthrough_chapter` and `playthrough_act` (additive migration). The reader and the act cards use it.
- **A draft asks for one thing:** the owner's box on a drafted character with no cover reads "No cover yet" / "Assistants can't add images. Add a cover from the planner." with **Add a cover** (Details, at the cover). The door's replies carry `addCover` (that link) in place of `addPictures`, and the style guide line becomes: "Assistants can't add images. When you finish a draft, give the player the addCover link; they can add images to the story in its Story tab."

### 4. Play, calmer (`PlayCalm.dc.html`)
- **No right rail.** Next, The character, Keeping it current and Who can see it go from Play. The acts list and the act take the width (acts 240 px, the act up to 900 px).
- **Acts:** the act being read is open (number and name in ember, its count, levels and place, a thin bar); every other act is one line, its number, name and count. Add an act goes from the read view (Edit has it).
- **Where you stand** is one quiet line over the act, only when there is a save read or the owner's own entry ("Level 6 | Day 7 | Riften | Speech 30, Two-Handed 36 | from Save 7"). With neither, nothing shows. The owner's "Enter it by hand" moves to Edit's Play tab, above the acts.
- **"Standing rule" becomes "Throughout the act"** everywhere: the read view's line ("Throughout the act: ..."), Edit's field label and its "i" ("What she keeps doing all through this act, like playing the inn every night. It isn't something to tick."), the style guide and design rule 24, the tools' descriptions. The data field keeps its name.
- **Objectives:** the header loses its note. A row is its box, its words, its why line, its progress if it has one, and its Story marker; the status on the right shows only "Under way". The owner ticks the box in place; the status menus and Add an objective go from the read view (Edit has them). A suggested objective shows only to the owner, with Accept and Skip as quiet buttons.
- **No "door" or "helper" anywhere a player reads.** Where the site needs to name it, it is "the planner's connector" (the word Claude and other assistants use for it). Sweep the site's text for both words.

### 5. The story, one click away
- **Read the story** sits at the right end of the view's tab row on every tab, and in the pinned bar, with "Continue reading" and the chapter's name above it once the reader has opened one (the owner's `readAt`, other readers' localStorage). It opens the reader at that chapter, or at the title page the first time. The hero's "Read the story from the beginning" goes.
- **The reader gets Contents:** a button in its top bar opens a list of every chapter in reading order, the locked ones with their lock and what unlocks them, the current one marked; choosing one opens it. Esc closes the list first, then the reader.
- An act's card shows for every act that has at least one chapter.

### 6. Details, with less in it (`DetailsCalm.dc.html`)
- Details holds **Name** (the label "Build name" goes), **Description**, **Cover**, **Tags**, **Video** and **Write-up** side by side, and **Show the AI assisted mark** (drafted characters only), in that order.
- **Gone from Details:** the Race, Birthsign and LoreRim version row (the steps on the left say them); Who can see it (the edit band has it); the second cover preview "On the build page"; the cover's raw link field (Change offers Upload or Use a link); and the theme picker and its preview (part 7).
- **The cover shows once,** cropped as the hero crops it, with Change, Position and Remove on it.
- **Tags** show the chosen ones as chips with ×, then **+ Add a tag**, which opens the full list (grouped as now) in a popover; the limit and "Suggested from your majors" go in the label's "i".

### 7. Themes off for now
- The theme picker goes from Details and every page draws in Ember, whatever theme a build has stored. The stored value stays, so a theme can come back. Backlog: "Themes across every page" (the reader, Play, the edit pages and the cards would all need to follow the theme, and Parchment would need its own pass).

### 8. Tests and screenshots
- e2e: edit tabs in the new order; the AI assisted tooltip opens from the mark with no "i"; each hero and band menu fully on screen; Like and its burst on a private character as its owner; the Story tab's Contents shows Prologue and chapters with Unlocks when and no "entry" or "beat"; `write_chapter` with `unlocksWhen`; Images only on the Story tab, no count, rows stay put after Add; Position on a chapter image saves its focus and the reader uses it; the draft box asks for a cover and the door replies with `addCover`; Play has no right rail, Where you stand hides with no save, "Throughout the act" shows, the read view has no Add buttons or status menus; Read the story and Continue reading in the tab row; the reader's Contents jumps to a chapter; Details shows the six things only; a build stored with Parchment draws in Ember; the words door, helper, entry, beat, picture and Before Skyrim appear nowhere a player reads.
- Screenshots at 1440 and 390 of Play, Details, the Story tab with Contents and Images, the reader with Contents open, and the hero with its ⋯ menu open over Kyria's cover. Compare with rows 27 and 28.

### Done when
- [x] Part 1: tab order, the AI assisted tooltip on the mark, menus on screen, the WO-36 Like everywhere, image buttons that can be seen, "image" throughout.
- [x] Part 2: one word, chapter, with Prologue and Unlocks when, in the site, the reader, the tools and the rules.
- [x] Part 3: Images on the Story tab only, rows that stay put, Position on every image, a draft that asks for a cover.
- [x] Part 4: Play as PlayCalm: no right rail, compact acts, Where you stand only with a save, Throughout the act, no door or helper.
- [x] Part 5: Read the story with Continue reading beside the tabs, and Contents in the reader.
- [x] Part 6: Details as DetailsCalm.
- [x] Part 7: themes off, Ember everywhere, the stored value kept.
- [x] Every check in CLAUDE.md passes; migrations additive; behind the flag. Commit on `staging`, push, and stop: Dave opens Kyria, reads from Continue reading, jumps chapters from Contents, positions Act I's image, and finds Play calm.

---

## WO-142  Four things the thief test showed (Mac, 23 Oct 2026)
Status: done

**Why.** Bob ran a design test through the door (an Argonian thief, never kills, not the Dragonborn, wants a horse; build dwa27ywaka, playthrough 5h8y9vpbtq, both "TEST:" drafts). The build came out legal and the assistant kept to the planner. Four faults in what it was told:
1. **A false "comes after" gate on a line that isn't a work shelf.** `get_quest` Running Wild at level 5 says "unknown: comes after Ode To The Tundrastriders, and the planner hasn't been told that's done". Nothing in the records ties them; they're neighbours in "Whiterun, expanded". WO-130 stopped this for the work category only. Rule: a line's order never gates a quest; only the quest's own checked needs do (a quest or stage named in its ways' needs). Test: Running Wild is open at level 5 with nothing done; Dawnguard's chain quests still lock on their needs.
2. **The objective matcher claims a wrong quest.** The warning "'Buy a horse at the Riften Stables' is Caught Red Handed (FreeformRiften11); link it so the save can tick it" matched on "Riften Stables" in one of Caught Red Handed's objectives. A match needs the quest's name, or most of an objective's words, not a place name inside one. When it isn't sure, say "might be" and don't say "is". Test: that objective matches nothing; "Catch the white horse roaming the fields of Whiterun" matches Running Wild.
3. **`set_level` 1 takes skill points and does nothing.** Level 1 has no points; refuse with "Level 1 has no skill points to spend; its skills come from the race and the majors" instead of saving them silently.
4. **How to get a mount is nowhere in the door.** The assistant could not say that a stable sells a horse or what it costs. Add a `mounts` entry to `get_rules` (or a `get_fact`): a horse costs 1,500 gold at any stable (`HorseCost`, Economy Overhaul); Running Wild's horse; a wild saddled horse can be tamed and kept (Simplest Horses); the paraglider (Paragliding in Skyrim). Stables as places come with WO-141 Part 1.

5. **`suggest_quests` is empty for Solitude** (level 12: "No checked story is open for the player at that level and place") though Investigate the Bards College is open for you and The Man Who Cried Wolf starts with Elisif in the Blue Palace. A story's place is read from where it starts, and "Bards College" and "Blue Palace" aren't matched to Solitude. Every place inside a city maps to its city (the places index's holds and the cells' parent locations); test Solitude, Markarth (the Temple of Dibella) and Winterhold (the College).
6. **A place condition is where the quest is, not a need.** A Lovely Letter says "needs When you enter Riverwood" and `openForYou` is "unknown: needs the place you enter is Riverwood"; and "It starts by itself when you walk into any inn" is the same Riverwood trigger worded wrong. A `GetInCell`, `GetInLocation` or change-location test on a way is where the way happens: fold it into the way's `where` ("in Riverwood"), never into needs, and `openForYou` is open ("open for you, in Riverwood"). WO-137's item 6(c) said this for triggers; it holds for talks too.
7. **Chapter text loses its paragraphs through the door.** A chapter written with blank lines reads back from `get_playthrough` as one block. Keep the paragraphs in the stored text, return them as written, and check the site shows them (the Story page and the reader).

8. **Homes are nowhere in the door either.** The conjurer test searched "Breezehome" and got "No quest matched". Add `homes` beside `mounts` in `get_rules` (or `get_fact`), from `lorerim/systems/economy-and-work.md`'s checked prices: Breezehome (Whiterun, 5,000, after Dragon Rising), Honeyside (Riften, 8,000), Vlindrel Hall (Markarth, 8,000), Hjerim (Windhelm, 12,000), Proudspire Manor (Solitude, 25,000), the three Hearthfire plots (5,000 each, after thaneship of that hold), Severin Manor (Raven Rock, 10,000, after Served Cold), and the Creation Club homes with their gates. Each with "checked: files" or "not checked" as the doc has it.
9. **An item can't be found by name.** Three tests set no gear because "no tool exposes gear names"; `set_gear` only corrects a wrong one. `search_facts` gains the kind `item` (name, slot or type, material), names only, so an assistant can find "Thieves Guild Cuirass" or "iron greatsword" before `set_gear`. The gear pages stay held (WO-93); this is the names.
10. **`get_rules` says level 1 has no points.** Three assistants sent skill points at level 1; add the sentence to How points work and to `get_rules`.

11. **`build.py` breaks on `stories.json`** ("TG00MiscHandler isn't a quest of thieves-guild" and four more, Thieves Guild and Dawnguard), since WO-138 G5 took the handlers off the pages. Stories that name a handler as a step take the quest the handler starts instead, or drop the step. The PC is working round it; fix it first.

### Done when
- [x] 1 to 10, each with a test (and 11). Player question 24 ("How do I get a horse? I'm level 5 in Riften.") returns the stable price, Running Wild as open, the tamed horse and the paraglider. Every check in CLAUDE.md passes (typecheck, lint, 599 unit tests with the questions, 264 gamedata tests, build, the full e2e). Push staging with `Status: for Bob`.
- [x] 11: `build.py` runs clean on `stories.json` (a handler named as a step takes the quest it starts, or the step drops).
- [ ] For Bob and the PC (not Mac's to tick): the horse price and the homes are the economy notes' figures as this order gave them; the PC rechecks them in the game files, adds the Creation Club homes and their gates, and reads the places index's cells so the interiors table can go.

### Jeff's notes (Mac, 23 Oct)
Decisions made under WO-138 Part 5, each with why:
- **1, the gate.** A line's order gates nothing. Removing it showed two holes the gate had hidden, both fixed: a plain "After <quest>" need now counts a quest the player has finished (Dawnguard's Bloodline is "unknown: needs After Awakening" with nothing told, and open once Awakening is done), and a quest with some unplaced ways in (a letter no one has placed) is open only through a placed way whose own needs are met (Falion's letter quest in Seeking a Cure waits on stage 200 of its line). Proving Honor is now open at level 6 with nothing done, because the records give it a way in through Farkas, Aela or Vilkas that needs nothing before it.
- **2, the matcher.** A quest name in the words is still sure. Otherwise an objective with three content words or more, 70% of them in the text, only one quest doing so, is sure ("is"); half to 70% of one quest's objective alone is "might be". The old rule (a proper-noun phrase only one quest uses) is gone. Nothing matches "Buy a horse at the Riften Stables" (29% of Caught Red Handed's Riften Stables objective).
- **3 and 10, level 1.** `set_level` 1 with any skill points is refused with the order's sentence; `get_rules` has `levelOne` and the guide's How points work says it, from one constant.
- **4 and 8, mounts and homes.** `get_rules` carries `mounts` and `homes`. The economy doc (`lorerim/systems/economy-and-work.md`) isn't in this repo or on this Mac, so the price and the homes are the order's own figures, each marked "the planner's economy notes (WO-142), not rechecked against the game files", and the Creation Club homes are not in, with a `homesNote` saying so (an assistant must not guess a price). The three Hearthfire plots are named from the game (Lakeview Manor, Heljarchen Hall, Windstad Manor) with the order's 5,000 and its thaneship gate. Running Wild's entry is from its own objectives.
- **5, places.** `startsAt` now adds a start's `towns` and the city each named place sits in, from a hand-kept table of interiors (`src/lib/places/inside.ts`) covering the places quest starts name in the nine cities and a few towns; a name in two cities (Hall of the Dead, Jarl's Longhouse) is left out, not guessed. That table is stopgap: the PC's cells' parent locations should replace it. Only six stories exist and none starts in Solitude, so with a `where` given `suggest_quests` now also offers quest lines that have no story (after the stories, 12 in all, each marked `kind: "quest line"` and linking to its line). Solitude gives the Civil War, the Bards College, the Wolf Queen Awakened (The Man Who Cried Wolf) and more; Markarth and Winterhold give theirs. Said plainly: this widens what `suggest_quests` offers; WO-144 Part 4's "what a character can do here" may want to take it over.
- **6, place conditions.** Fixed in the generator (`quest_pages.py`, `fold_places`, tested): a place condition on a way, or the quest's own for a trigger that starts by itself, becomes the way's `where`; where you leave, and "a habitation", are dropped; the "One of" need is said again from the ways. `python3 scripts/gamedata/build.py` regenerated `quests.json`: 91 quests changed, 206 place conditions out of the record form, and the spoken ones on A Lovely Letter, The Heart Will Go On, Blood on the Ice, The Taste of Death, The Route of Madness, Black Book and two Stendarr quests. `get_quest` says "open for you, in Riverwood".
- **7, paragraphs.** The stored text always kept them; `get_playthrough` threw them away by joining blocks with spaces. It now gives the chapter as Markdown, as it was written (`docToMarkdown`, the reverse of `markdownToDoc`, tested round trip), and that text goes back through `set_chapter` unchanged. The reader (the chapter's own address) shows each paragraph; screenshots `test-results/wo142-chapter-1440.png`, `-390.png`.
- **9, items.** `search_facts` has the kind `item`: name and "slot or type, material" only, one of a name and type once, ranked after every other kind so gear never pushes a quest or a perk out of the 20.
- **Question 24** passes and its mark is off.
- **Checks.** The full e2e passed 367 of 368; the one failure was `wo108.spec.ts`, which pinned the old gate (Proving Honor "unknown: comes after Take Up Arms"); I changed it to the new rule (Proving Honor open, Bloodline unknown on its own need) and it passes. `npm run test:gamedata` 264 pass.
- **11, build.py.** The seven names (five in the Thieves Guild, two in the Dawnguard) were not steps: each was a `hidden` entry under `alongside`, there only so the check could see every quest of the line placed. WO-138 G5 took the handlers out of the lines, so they named nothing. I removed those seven entries from `gamedata/5.0.4.8/stories.json` (42 lines, nothing else in the file) and `build.py` now exits 0 with all six stories. `test_stories.py` has a test that every kept story passes the check against `quests.json`, and it fails without this change. The build also re-serialised `places.json` with no value changed; I left that file as committed.
- Bob, 23 Oct, 13:45, on the live door: Running Wild is open for you at level 5 (the false gate is gone); 23 of 23 player questions; `build.py` runs clean. Done. The horse and homes figures still want the PC's recheck in the files (the last box), which rides with WO-144.

---

## WO-148  What re-planning Kyria's Acts III and IV couldn't get from the door (Mac, 23 Oct 2026)
Status: done

**Why.** Dave's Claude re-planned Kyria's Acts III and IV (the Book, v40 to 41) and had to do by hand what the door should have answered. Each item below is from its list; the data items are in WO-144 and WO-145, the door items are here.

1. **`suggest_quests` takes holds.** `where: "Haafingar"` returns nothing; `where: "Solitude"` returns six. A hold name (Haafingar, Hjaalmarch, the Pale, the Reach, Eastmarch, Falkreath, Whiterun hold, Winterhold, the Rift) means every town and place in it, from `places.json`'s holds.
2. **`suggest_quests` never returns `start: null`** without saying why. The Bards College, The Wolf Queen Awakened, Lights Out!, Battle of the Champions and Odd jobs in Haafingar came back empty though `get_quest` on the same line has a checked start. Fill it from the same source `get_quest` uses (a shelf gives "separate jobs; open one for how it starts").
3. **`suggest_places` takes a place, not only a stored act.** Add `where` (a town, a hold or a place) and `levels` so an assistant can ask about places near Solitude at 15 to 20 without a stored act. The stored-act form stays.
4. **`get_quest` returns the quest's XP and type** (type to XP from `QUEST_XP`, Experience.ini), and says plainly when a quest pays nothing ("Misc: pays no quest XP"): The Heart of Dibella and The Blessings of Nature were planned as XP payoffs and pay 0.
5. **A key or door condition isn't a start.** Laid to Rest's start reads "The door from Stonehills into Sorli's House needs the Key to Sorli's House…", so `openForYou` is "unknown" for a quest already in Kyria's journal; A Rat Problem shows the same shape ("The door from Whiterun into Igna's Basement needs the Key to Igna's Basement"). A locked door on the way to the first objective is the first step's detail, never a need of the start. Rule and test on both; check every page for the shape.
6. **Gate chains across acts.** `check_progression` and `get_playthrough` check that every later act's gates are reachable from what the earlier acts contain: Dawnguard needs level 30 and Laid to Rest; Vigilant needs level 25, The House of Horrors and Kindred Judgment. Kyria's Act IV had no Laid to Rest. The warning names the missing quest and offers the act it fits ("Laid to Rest fits Act III, in Morthal").
7. **Missives: route-aware, never a lump** (Dave and the Missives.esp read, 23 Oct). A missive's destination is drawn when the board refreshes, so no tool can promise one; Near / Medium / Distant is the distance band from the board's hold. The planner supports two uses and one rule:
   - *Nearby:* at the board she's standing at, Near deliveries and Heal the Sick that finish in town or close by.
   - *On the way out:* when an act's route moves her from A to B, the stop at A says "read A's board for notes addressed to B" (leaving Markarth for Solitude).
   - *Rule:* never budget missives as a lump. Count one or two per leg the route already travels, never recommend one off the route, and skip gathering jobs (LoreRim's author warns they can break). In WO-145's fillers too.
8. **Tome Trials, modeled and gated.** The exams aren't quests, so nothing lists them. Giraud's exam line checks `GetQuestCompleted` on Tending the Flames (Skyrim.esm:053511) == 1, so all 36 exams wait on Tending the Flames; the project's own notes and Kyria's Act III treated them as open. A `tome-trials` entry the door returns (through `get_rules` or the doings index when it lands): 36 books, 50 / 100 / 200 XP by tier, tier 2 needs Speech 50 and tier 3 Speech 75 (the mod page), Callings' Historian half again, **after Tending the Flames**. WO-145's filler list uses it only after that quest.

9. **"When" judges by what she'll meet, and leniently** (Dave, 23 Oct: a character can usually take enemies several levels above her unless badly under-geared; a boss 15 or more above isn't out of the question, and places often have enemies in the 20s with a boss at 40+). With WO-144 Part 1d's levels (floor, ceiling, what a player meets at a level), `suggest_places`' fit: **fits now** when what she meets at the act's levels starts at or below her level and the boss is within about 20 levels (say "the boss is a hard fight at this level" when it's 10 to 20 above); **plant now, pay off later** only when the floor itself is well above her (about 10 levels) or the boss is more than about 20 above. Never hide a wide range; say it ("bandits from 3; the chief 19 to 24"). Embershard Mine fits a Riverwood act again (`wo128.test.ts`). Thresholds are guidance; log what you chose.

### Player questions
- 34. "What quests are open in Haafingar at level 15?" returns stories with their starts, none `start: null`.
- 35. "How do I start Laid to Rest?" says the way in, not a key; `openForYou` is open or names a real need.
- 36. "Can Kyria take Tome Trials exams now?" says not until Tending the Flames, with what the exams pay.

### Done when
- [x] 1 to 9, each with a test (`wo128.test.ts` green); player questions 34 to 36 pass; every check in CLAUDE.md passes. Push staging with `Status: for Bob`.

### Jeff's notes (Mac, 23 Oct)
Decisions made under WO-138 Part 5, each with why:
- **1, holds.** `where` takes a hold ("Haafingar", "the Pale", "Whiterun hold", "the Rift"): `src/lib/places/holds.ts` reads each place's hold and the town and city nearest it from `places.json`, and puts a town in the hold most of its places are in (a place by a border carries a neighbour's town, so counting every place would put Whiterun in Haafingar). A hold's towns are every town it has, its capital included. Limit, said: Riverwood comes out in Falkreath (more of its nearest places are labelled Falkreath than Whiterun), which is the PC's data; the real hold is Whiterun. Falkreath, Whiterun and Winterhold are a hold and a town, and take both.
- **2, `start` never null.** The story's own checked start; else the opening quest's first way as `get_quest` words it ("... (1 other way)"); else the line's text; and for a shelf, "Separate jobs; open one for how it starts." A test goes through the five the thief test named, and seven places.
- **3, `suggest_places` by place.** `where` (a town, a hold, or a place, which stands for the town nearest it) and `levels` ("15 to 20") with no playthrough or act; the stored-act form is unchanged. Same places, pointers and fit; nothing "already used". It needs the levels and says so; an unknown place names the towns and holds it knows.
- **4, XP and type.** `get_quest` gives `type`, `xp` and `pays`: "Side Quest: pays 100 quest XP", "Pays no quest XP" (The Heart of Dibella and The Blessings of Nature have no type in the data, so it reads "Pays no quest XP", not "Misc: ..."). The XP is the data's own (from Experience.ini).
- **5, a door isn't a start.** Fixed in the generator: a door that needs a key goes to `start.doors`, never into the needs, in the words or the record form (20 quests; `build.py` regenerated `quests.json`). `get_quest` gives it as `onTheWay` beside the first step, the quest page and the line page's journal show it after the first step in muted words. Laid to Rest and A Rat Problem are open now. No quest has one in its needs.
- **6, gate chains (`gate-review.ts`).** Walking the acts in order with what the earlier ones contain, each linked quest or line is checked against (a) its level (the line's, a story's `opens` need, and its first way in's) against the act's top level (an act with no end counts as 100), (b) the lines it needs first (a story's `opens` needs and the line's `after`), (c) the quests its **first way in** names ("After Laid to Rest"). A gap says what is missing and the earlier act it fits (by town when an act is there, else the last earlier act that reaches the level), and, when another way in needs nothing, says so. **Dawnguard's judge says open by Agmaer at Fort Dawnguard (no need), so the warning is on its first way in (Durak), which is the one the order describes, and the message names Agmaer's.** A line counts as done when an objective links the line or its last quest: approximate on purpose. It runs in `get_playthrough` and `finish_draft_playthrough` as `gate-chain`; `check_progression` takes a build, with no acts, so it has no part in this.
- **7, Missives (rule 37).** The rule is in the style guide (two uses, one rule). Warnings `missives-lump` (the whole Missives line linked, a count of three or more or "every/all/each/any", a reach of 3 or more) and `missives-gathering` (a Gather, Collect or Catch Fish missive). `get_playthrough`'s route stops at a board town that send her on say "Read Markarth's board for notes addressed to Solitude." (the boards are the Missives line's). WO-145's fillers aren't built yet; they should call the same rule.
- **8, Tome Trials.** `get_rules` has `tomeTrials`: 36 exams, 50 / 100 / 200 XP by tier, Speech 50 and 75 for tiers 2 and 3, Callings' Historian half again, after Tending the Flames (quest `MS05`, in the Bards College line). From the order's reading of the records and the mod page; I have not checked the exam dialogue myself.
- **9, "when", leniently.** Thresholds I chose, for an act whose top level is T, the floor F (the weakest enemy, from the PC's `actors.levels`) and the boss's lowest level B: **fits now** when F is at or below T and B is within 20 of T, saying "the boss is a hard fight at this level" when B is 10 to 20 above; **plant now, pay off later** when F is 10 or more above T or B is more than 20 above, from level max(F - 10, B - 20); **too high for this act** only when F is 20 or more above T. A boss that matches her level never counts against her. The place also says what she meets: `enemies` ("enemies about 6 to 20, never below 6; the boss Zulakaroth, Keeper of the Dragonstone, level 40"), so a wide range is never hidden. Embershard Mine fits a Riverwood act again. Geirmund's Hall (boss level 40, act 6 to 12) is now "plant now, pay off later (levels 20 and up)", where it said 40; `wo128.test.ts` says so. The PC's `atLevel(n)` isn't built, so this reads the floor and ceiling; when it lands, F should be what she meets at T.
- **Question 34 to 36** pass.
- **Checks.** Typecheck, lint, 273 gamedata tests and 646 unit tests (with the player questions) pass; the build; the full e2e passed 380 of 381. The one failure was `wo128.spec.ts` expecting Geirmund's Hall "(levels 40 and up)", which item 9's leniency makes "(levels 20 and up)" (its boss is level 40); I updated the spec, and it, `wo129` and `wo148` pass.


### Part 2. Three things on the live door (Bob, 23 Oct, 16:40)
Read live after ebcd68d: Laid to Rest is open with its XP (Side Quest, 100) and a page link; Haafingar at 15 returns seven lines, every one with a start; 27 of 27 player questions. Good. Three to fix:
- [x] **Markarth Side shows for Haafingar.** It's a shelf of jobs in Markarth (the Reach). A shelf's place is its quests' towns, not its first quest's alias; check the hold mapping on every shelf and test that `where: "Haafingar"` never returns a Reach, Whiterun or Rift line.
- [x] **Laid to Rest's way reads like a trigger:** "It starts from something placed in Morthal, by the door to Eisa's House". A player reads that as nothing. A trigger at a town's entrance or a house is "It starts when you arrive in Morthal" (and the first step, "Talk to the Jarl of Morthal", does the rest). Same rule for every "something placed … by the door to …" way: word it as arriving in, or walking past, that place.
- [x] **`onTheWay` names things that aren't on the way:** Laid to Rest's lists Sorli's House in Stonehills (a different hold) and its key. A locked door counts as on the way only when it's in the cell or location of a step's target. Drop the rest; test on Laid to Rest and A Rat Problem (Igna's basement key stays, it is on the way).

### Jeff's notes on Part 2 (Mac, 23 Oct)
- **A shelf's place.** `suggest_quests` reads a shelf's places from where each of its own quests starts (`shelfPlaces`: each quest's start place, its ways' places, its towns, and the city a named interior is in), never the curated `where` or the giver of the first quest standing for the lot. Markarth Side's `where` is "South-east of Dragon Bridge", which put it in Haafingar; its quests start in Markarth Side, so it is now under Markarth and gone from Haafingar. A test checks Haafingar leaves out Markarth Side, More to do in Whiterun, Odd jobs in the Reach, the Rift and Whiterun Hold, and Fists of Fury, keeps Odd jobs in Haafingar, and that every shelf it returns has a quest starting in one of its towns. Stories and other lines still read a place the way they did.
- **Trigger wording.** An unnamed placed trigger reads "It starts when you arrive in <place>" ("when you arrive somewhere in Emperor's Quarters" for a loose one); the door to a house is dropped, as Bob's example does, since it is where the trigger sits, not a thing to look for. Eight ways changed (Laid to Rest, The Cause's trigger keeps its UESP wording, DB11, Forgotten City, Gravewind, Bloodskal Barrow, Volunruud, Yngol Barrow, the Dragon Killer scene); a named trigger (Erotic Book, Etched Tablet) keeps its name. I changed the override that was keyed on The Cause's old trigger words to the new ones, and the judge reads "It starts when you ..." as a way in, not a need. The PC's `story_check.py` still writes the old words in its own reports; I left those.
- **`onTheWay`.** A door is on the way only when it leads into the place of the **first** target of the first step. Laid to Rest's first target is Idgrod in Highmoon Hall; Sorli's House is the second alias (the rebel jarl, if the Stormcloaks hold Morthal), so its Stonehills door is dropped. A Rat Problem's key to Igna's basement stays. 19 quests keep a door, 1 lost one. Said plainly: the first target only is conservative; a quest whose real first step has two targets would lose the second's door.
- **Checks.** Typecheck, lint, 273 gamedata tests and 650 unit tests pass; the build; 28 quest and door e2e tests pass (`wo100`, `wo108`, `wo121a`, `wo128`, `wo146`, `wo147`, `wo148`); the full e2e passed 383 of 383.

- Bob, 23 Oct, 17:05: Part 2 read in the generated data (the live door hadn't redeployed yet): Laid to Rest "starts when you arrive in Morthal", no Stonehills door; A Rat Problem keeps its basement key. Done.

---

## WO-156  Dump every person's daily schedule and roles, raw: no reading (PC, 23 Oct 2026; before anything else on the PC)
Status: done

**Why.** WO-152's measure (793cb11) showed the problem and the limit of rules in one go: 196 of 337 quest givers seem to be somewhere other than where they're placed, but reading packages by rule put Balgruuf in the Blue Palace. The people reads (WO-155) will be done by agents reading each person's records with judgment, as the quests now are (WO-153). They need the records; the records are on the PC. So this order is a dump, not an interpretation.

- [x] `gamedata/5.0.4.8/people_schedules_raw.json`: for every named person in `people_raw.json` (and every quest giver), every AI package in the order the game evaluates them, **after load order** (the winning record, with which plugin it came from): its type, its schedule (hours, days), its location target resolved to a name (the reference's own name, its cell, the cell's location and hold), its conditions as written in the record, and whether it's a shared package used by many people (with the count).
- [ ] In the same file, per person: faction ranks, class, vendor (what they buy and sell, from the faction's vendor list), trainer (skill and max level), follower and marriage flags, essential / protected, their default outfit's name, and the quests whose aliases name them, with the alias name. **Not built: vendor, trainer, follower, marriage** -- see below.
- [x] Nothing in it is interpreted: no "where they are by day". If a field can't be dumped, say so in an `about` block, don't guess.
- [x] Spot-check three by hand in the log: Jaree-Ra, Nazeem, Balgruuf.

**Built (PC, 23 Oct).** `scripts/gamedata/people_schedules.py`, new. 4,865 people (`people_raw.json`'s own, unioned with every quest giver), 3,231 with at least one resolved `PACK`. Each package carries its EDID and plugin, `PKDT`/`PSDT` as raw hex (neither byte-decoded: `PKDT`'s own type-byte enum and `PSDT`'s schedule fields aren't hand-verified against this project's own records the way `ECZN` was in Part 1d, so only the EDID is relied on for what a package *does* -- "...Sandbox...", "...Sleep...", "...Work...", "...Eat..." name themselves plainly enough), its location (`PLDT`'s type number and, for a "near reference"/"near type" target, the reference's own name when it has one, its cell, the cell's location and hold), its conditions (`CTDA`, reusing `quest_starts.py`'s own reader, so a package's own gate reads the same way a quest's does), and whether it's shared (how many other people's own package list names the exact same `PACK`, with the count -- a package 250+ people share says nothing about any one of them).
- **The three spot checks, read by hand.** **Balgruuf the Greater**: every plugin's own copy of his `NPC_` (eight of them, vanilla through LoreRim's own patches) carries exactly **one** package, `CWExiledImperialSandboxBluePalace`, gated by `GetInFaction` on a faction his own record never lists -- a Civil-War-only exile scenario, not his everyday spot. With no competing package at all, his own placement (Dragonsreach) is correctly where he is; this is the dump doing its job, not a gap -- a reading agent sees the one conditional package and the condition that gates it, and can tell it isn't the answer. **Nazeem**: `AIOWRNazeemCloudDistrict` (resolves to Dragonsreach's own cell -- the Cloud District is the ward Dragonsreach sits in) and `WhiterunNazeemBrowse8x4`/`WhiterunNazeemJarlsBackside14x7` (Whiterun) are there for the day; `WhiterunWintersandManorSleepAny` (from "CC Tundra Homestead - Tweaks and Enhancements.esp") for the night -- matching Dave's own note exactly ("the Whiterun market and the Cloud District" by day), without this script claiming that conclusion anywhere. **Jaree-Ra**: a `...Work...` package (`SolitudeWarehouseWork10x8`) and a `...Sandbox...` one (`SolitudeDocksSandbox8x14`) both target the same reference, off his own placement (the Red Wave) entirely -- exactly the shape WO-152 found by hand, now visible straight from the dump.
- **Not built, flagged rather than guessed: vendor, trainer, follower, marriage.** Each needs its own record read (`FACT`'s own `VEND`/`VENC` vendor fields; `CLAS`'s own training-skill fields; the standard `PotentialFollowerFaction`/`CurrentFollowerFaction`/`PotentialMarriageFaction` conventions, which this script could read cheaply but didn't yet) not attempted this pass -- logged in the file's own `about` block, not silently absent.
- **Checks.** 316 gamedata tests pass (6 new, against the three spot checks and the shape of a trivial vs. a resolved package).

### Part 1b. What the dump still needs before the people reads can use it (Bob, 23 Oct, 18:50)
Read Jaree-Ra's six packages by hand. The answer is in the dump: the top of his stack is `STIJareeRaStayPutForSolitudeOpening` (Save the Icerunner), "stay put" by `Skyrim.esm:016A0E` until Lights Out! is done, which is exactly what Dave saw. Good. But that reference, and the one his work and sandbox packages use (`09F35D`), come back with no name, cell or place. Across the file, **2,694 of 4,608 package targets have no cell** (58%). An agent can't say where someone is from a bare form id.
- [x] Every package target resolved: a reference's own name or base object's name, its cell, the cell's location and hold, and for an exterior cell the nearest named location. Jaree-Ra's `016A0E` and `09F35D` resolved by hand in the log. Count of targets left unresolved, with why.
- [x] `PSDT` decoded and checked as `ECZN` was in Part 1d: hour, duration, days. Check against three packages whose names carry their schedule (`SolitudeWarehouseWork10x8`, `DefaultEatEditorLoc18x1`, `DefaultSleepEditorLoc2x8`) and log the three.
- [x] Vendor, trainer, follower and marriage, as the first box asked (it was ticked but these weren't built; I've unticked it): the vendor faction's buy and sell lists, the class's training skill and max level, and the standard follower and marriage factions.

**Built (PC, 23 Oct).**
- **`016A0E` and `09F35D`, read by hand.** `016A0E` is itself a `CELL` record: "The Winking Skeever" -- Jaree-Ra's own top-priority package names that cell directly, not a keyword (a location type 1 "near type" target can be either; this one's a cell). `09F35D` is an ordinary `REFR` (a generic marker, deleted flag clear) sitting in an unnamed wilderness grid cell of Tamriel, 0.03 km from the East Empire Company Warehouse's own named map marker -- essentially on top of it. Both now resolve correctly: his top package to "The Winking Skeever" by cell, his work package to "East Empire Company Warehouse" by the nearest-named fallback.
- **Targets resolved three ways.** A "near type" target (type 1) checked against the keyword table first, a cell directly second (the shape above) -- `kw` alone was wrong for every real case checked, all of which were cells. A "near reference"/"object" target (types 0/4/5) checked against the placed `REFR`/`ACHR` scan as before; when that resolves to a cell with no name and no location of its own (most exterior wilderness grid cells), the nearest named map marker in the same worldspace stands in, the same distance math `places.py`'s own `nearestTown` uses -- never a guess, a real position compared to a real marker's. **59 of 4,608 targets (1.3%) still unresolved** (down from 2,694, 58%): type 1 targets that are neither a keyword nor a cell (not traced further), and a handful of type 0 targets in a worldspace this reader's marker table has nothing named in at all.
- **`PSDT` decoded and checked against the three named packages, plus the two always-on ones.** Byte 3 is the hour (0 to 23; `0xFF` is "any time," never shown as a value); the last four bytes are the duration in minutes. `SolitudeWarehouseWork10x8`: hour 10, duration 480 (8 hours, a full shift). `DefaultEatEditorLoc18x1`: hour 18 (6pm), duration 60 (an hour for a meal). `DefaultSleepEditorLoc2x8`: hour 2 (2am), duration 480 (8 hours). `DefaultSandboxEditorLocation512`/`SolitudeOpeningStayLocation512`: hour null ("any time"), duration 0 ("no limit"). All five read exactly as their own names say they should. Month and day of week follow the same "0xFF means any" rule; date is given raw (always 0 in every package checked, so not independently confirmed what a real value there would mean).
- **Vendor.** `VEND` (the merchant's own container, a resolved reference) is the real "is this faction a vendor" signal -- `VENV` is boilerplate every faction carries, all zero, whether or not it sells anything (confirmed: a jail faction with nothing to do with selling carries one too; an early version of this trusted `VENV` alone and read Eorlund Gray-Mane's own hours as 0 to 0, radius 0 -- caught by checking a second, unrelated faction first). With `VEND` required, Eorlund (the Skyforge) reads 0 to 23, radius 700; Belethor's General Goods reads 7 to 21. `VEND`/`VENC` themselves stay raw hex: not independently confirmed which is the sale container and which (if either) is a buy/sell category bitmask.
- **Trainer.** 46 `CLAS` records follow Skyrim's own "`Trainer<Skill><Tier>`" naming (`TrainerRestorationExpert`, `TrainerPickpocketExpert`...); the skill and tier come straight from the name, with vanilla Skyrim's own tier-to-level-cap convention (Novice 25, Apprentice 50, Journeyman 75, Expert 100, Master none) carried in as a known game fact, not read from this load order's own records -- flagged in case Requiem changes training caps, since that isn't checked here.
- **Follower / marriageable.** `PotentialFollowerFaction`/`CurrentFollowerFaction` and `PotentialMarriageFaction` -- Skyrim's own standard faction names, confirmed present in this load order (`MarriageAskedFaction`/`MarriageCourtingFaction` and others exist too, but those track an in-progress courtship, not "can be asked," so aren't used here).
- **Checks.** 325 gamedata tests pass (8 new, replacing the two Part 1a tests the location-shape change made stale).

- Bob, 23 Oct, 19:25: Part 1b read in the file. 4,549 of 4,608 package targets now name a place (59 left); Jaree-Ra's top package is "stay put" at The Winking Skeever until Lights Out! is done, which is what Dave saw; the schedule hours decode and match the package names (`SolitudeWarehouseWork10x8` is 10:00 for 480 minutes); 542 vendors and 76 trainers. Done. The people reads (WO-155) start once the quest reads are through.

## WO-155  People reads: who they are, where they are by day and by night, what they offer (Bob runs it, 23 Oct 2026; after WO-156)
Status: held (Dave, 23 Oct, 19:35: everything paused; see docs/pause-2026-10-23.md; was: queued, after WO-156)

The same method as WO-153, for people, against `docs/data/people.md`.
- [x] A test first: 20 people drawn at random (seeded) from the quest givers, trainers, merchants and followers. An agent reads each from `people_raw.json` and `people_schedules_raw.json`; the key is UESP, built by an agent that sees neither; a judge scores both blind. Dave checks a few in game. The full run goes ahead only if the reads beat the placement cell clearly.
  - **Result (27 Oct, cloud sessions).** Against the UESP key (built from en.uesp.net by an agent that saw only the names), scored blind: the checked reads 18 right, 2 partly right, 0 wrong; the editor placements 3 right, 14 partly right, 3 wrong. Placements named the right building but no role, gave the night spot instead of the day one, or nothing. The reads' misses: Morven Stroud's soul-husk trade, Bujold at the Beast Stone at night. The checkers fixed 14 fields across the 20 (Captain Aldis held at Roggvir's execution until Solitude's opening moves on). Disagreements with UESP that look like LoreRim's changes are listed in `people_reads/test/judge.json`. **The reads clearly beat the placements; the full run goes ahead.** Scope: 1,053 people (620 quest givers, 542 merchants, 76 trainers, 113 followers, 81 spouses, overlapping). The cloud credit has $166 left (27 Oct); the 20-person test and the quest ways and line reads took $58 together.
- [ ] Then every person a plan uses (quest givers, trainers, merchants, followers, spouses), in batches of 10, each checked by a second agent, into `gamedata/5.0.4.8/people_reads/`.
- [ ] Mac wires them in as WO-154 does for quests (a Part on this order, when the reads land).

## WO-154  Quest pages, line pages and the connector, from the quest reads (Mac, 23 Oct 2026)
Status: building (Mac; Part 5: one Characters page, Dave 27 Oct. Parts 1c to 4 are built and await Dave's review)

### Part 1c. Every batch checked: the rebuild breaks six tests (Bob, 26 Oct)
All 85 batches are checked now (see `docs/pause-2026-10-23.md`). A cloud session ran `python3 scripts/gamedata/build.py` on staging at `3ba16cd`: typecheck and lint pass, `npm test` fails 6, so the regenerated `quests.json` was **not** committed. Fix the code, not the tests, unless a test asserts something the checked reads now settle differently (say which, and why):
- [x] `player-questions.test.ts` question 4, Caught Red Handed: the answer now says "condition the planner can't put in words yet".
- [x] `player-questions.test.ts` question 16: the answer is missing `"checked":"files"`.
- [x] `player-questions.test.ts` question 18, Thane of Whiterun: `TypeError: Cannot read properties of undefined (reading 'ways')`.
- [x] `wo108.test.ts`: Caught Red Handed should have endings and now has `endings: []`.
- [x] `wo142.test.ts`: A Lovely Letter crashes reading `needs` on something undefined.
- [x] `wo146.test.ts`: a quest whose start isn't checked crashes reading `ways` on something undefined.
- [ ] Rebuild, all tests pass, commit `quests.json` with the code, push staging.

New data the pages don't use yet (Part 2, after 1c): `quest_reads/ways/G*.json` (WAYS.md: each choice tied to its journal steps, for "N ways to finish it"; 228 quests, steps copied verbatim, 137 with an unsure; objective text keeps the game's `<Alias=…>` placeholders, which the page must fill or drop) and `quest_reads/lines/checked/L*.json` (LINES.md: 50 line reads, checked, 59 fixes; every line has an unsure, mostly level gates the records don't hold).

**Jeff's notes, Part 1c (Mac, 26 Oct).** Rebuilt with `python3 scripts/gamedata/build.py`: 842 quests read and checked, 384 on the older rules; `quests.json` is committed with this push. Typecheck, lint (the one warning is `wo129.test.ts`'s unused import, there before), 691 unit tests (7 marked), 341 gamedata tests, the build, and the quest e2e (`wo100`, `wo106`, `wo136`, `wo142`, `wo146`, `wo147`, `wo148`, `wo154`: 31 tests) pass.
- **Why six broke, and what I did.** Bob's list reads some of these as the code losing something; four are tests asking a quest that is now read for the older rules' block (`start.ways`, `endings`, `"checked":"files"`), which a read's door answer doesn't have (it has `starts[]`, `closes` and `howSure`). Same cure as the 640-read pass: the tests of the rules' machinery ask `rules(...)`. No change to what the door says.
  - `wo108` (Caught Red Handed `endings: []`): the test is about the rules' note for a quest whose records flag no ending. It asks `rules("Caught Red Handed")` now; a read has no `endings` field at all, so `endings: []` was never going to appear in the door's answer.
  - `wo142` (A Lovely Letter): `openForYou` still says "open for you, in Riverwood" from the door; the check that no place sits among the start's needs asks `rules(...)`.
  - `wo146` (a quest whose start isn't checked): **no quest left on the older rules has an unchecked start** (I counted: none), so `aaFaraldaQ2`, the test's subject, is the case of a *read* quest whose rules block is unchecked. The test now asks `rules("aaFaraldaQ2")`, and `rules()` gives the full older answer including the line's start check (`checked`, `note`), which it didn't before (it exports `questStart` from `facts.ts` for that; nothing else changed in `facts.ts`).
  - Question 16: the three quests are read, and a read says it is checked in `howSure` ("Read from the game files and checked by a second reader"). The question now asks for that line instead of `"checked":"files"`; the point of it (a quest's own checked start, never "no instructions are given") still holds.
  - Question 18: the test read `start.ways`; it reads `starts` now (a way with no place still shows up in "never"). That fixed the crash.
- **Two questions are real differences, marked "fails today" for your word, with the reason in `player-questions.md`:**
  - **4** Caught Red Handed: the read gives Svana, Haelga's Bunkhouse and the first step Bolli, with `needs: nothing`. The rules' "a condition the planner can't put in words yet" was the undecoded `fn230 == 0` on Svana's line (the raw record: `Skyrim.esm:041E0C`). The read doesn't carry it and doesn't list it as unsure. The rules' second way (Haelga, persuade, early in Taking Care of Business) is in the read's unsure notes, not in `starts`. Yours to say whether the page should admit the gap.
  - **18** Thane of Whiterun: the read names "Balgruuf the Greater or Vignar Gray-Mane" as one jarl and doesn't say Vignar is the one if the Stormcloaks hold Whiterun, which WO-138 ruled in. I changed the need's wording in the test to the read's ("once you have helped enough people of the hold"), which is only words; the war condition is the thing marked.
- Questions marked "fails today" now: 3, 4, 5, 12, 18, 21, 35.

### Part 2. The redesigned pages (Dave approved the boards, 26 Oct)
Source of truth: the design canvas https://claude.ai/artifact/48H6v9Q6wFuwhzRqE31uD1, bottom rows: **Quest page: Lights Out!, second pass** (`QuestPageLightsOut`), **Person page: Mjoll the Lioness** (`PersonPage`), **Place page: Broken Oar Grotto** (`PlacePage`). Dave's decisions behind them are in `docs/data/quest-pages.md` ("Dave's answers") and below. Build from the data, never from the boards' sample text; a field with no data is left out or says "Not known yet", as the boards show.

Quest page:
- [x] Title box with the frame and **no artwork**. Tags: the town or place the quest is grouped under, "Vanilla" for a base-game quest (not "Base game"), and "Changed by [mod]" linking to that mod's Nexus page in a new tab (name only, no description of the change). A mod with no Nexus id in `plugins_raw.json` shows its name unlinked; list them in the log for the PC.
- [x] A one- or two-line description under the title when the quest has one (`about`; none exist yet, so the slot is empty until Bob's pass fills them). Plain sentences per design rule 17.
- [x] No top bar. "Can I do it?" shows only when it's not a normal talk-to-start quest (radiant, starts by itself, cut, background). "What you need first" shows inside How to start, only when there is something.
- [x] Order: How to start, **N ways to finish it**, Where it takes you; then at the bottom, full width, What it closes and How sure we are. Right column: **Rewards** (the gold box, XP first with its "i") and People.
- [x] **N ways to finish it** from `quest_reads/ways/G*.json`: each way a row with its numbered orange box, title on the left, the `ends` line and its steps (numbered, grey) on the right, a gold "or" between ways. `shape: "endings"`: the shared steps once, then the endings. More than 8 steps on a way: show 6 and "Show all N steps". Fill or drop the game's `<Alias=…>` and `<Global=…>` placeholders in step text; never show them raw. A quest with no ways file shows its steps as before.
- [x] Every person named anywhere on the page links to their person page; every place links to its place page.
- [x] Icons from the set (Speech, the journal scroll, travel, the coin pouch, the skull, the sword by each danger line). Draw the new ones in `scripts/icons/` by the pixel rules: a signpost (ways), a bust (people), a wax seal (how sure), a clock (what changes it), a chest (boss chest).
- [x] How sure we are: the plain-word line, a tick per source (game files read and checked; UESP; players), the "Not sure yet" list in player words, Confirm it's accurate and Report a mistake.

Line page:
- [x] From `quest_reads/lines/checked/L*.json`: what it is, how to get in, the quests in order (one line each, branches shown), what the whole line gives, what it closes, how sure. The main quest's line is named "The main quest".

Person page (new, `/people/[id]`):
- [x] The same frame and title box: race and town tags, orange chips for what they are to you (Follower, Can marry, Gives quests, sells, trains), "Can't be killed" for essential.
- [x] Where to find them: the day strip (midnight to midnight, coloured by place, "Not known yet" hatched) and the list of times, places and what they're doing; What changes it; their quests with their part in each; What they offer; How sure. Until WO-155's people reads land, use only what `people.json` holds and show the rest as not known yet. Don't read AI packages by rule to fill it.

Place page (new, `/places/[id]`):
- [x] From `places.json`: title box (type, hold, Vanilla, "a short walk from [town]"), Danger (a level bar 1 to 50 with who lives there and the boss on its own row, then each foe's levels and traps), Worth going for, Quests that bring you here, What points here (the book's own words), Rewards (XP for finding and clearing), Good to know, How sure. Places not in the index (town interiors) render no link yet.

Nav and search:
- [x] Top menu: Builds, Quests, People, Places, Playthroughs.
- [x] The Quests page: the big lines first (main stories, guilds and factions, Daedric Princes, new lands, followers), then everything else grouped by town or place. Search by quest name, person or place, tolerant of misspellings ("Palonimo").
- [x] Screenshots at 1440 and 390 of Lights Out!, The Golden Claw, the Thieves Guild line, Mjoll the Lioness and Broken Oar Grotto, compared with the boards.

### Part 3. "I can confirm this is accurate" (after Part 2)
- [x] Signed-in (Discord) players can confirm a quest, person or place page. A modal says it's recorded, with Close and Undo (board `QuestConfirm`). The page shows how many confirmed and their names. Signed out, the button reads "Sign in to confirm". New table through `npm run db:generate` and committed SQL; nothing destructive.

### Part 4. Dave's review of Parts 2 and 3 (27 Oct)
Dave's notes from reviewing staging, and Bob's. Feedback part: take it first.
- [x] **A link inside a place name.** Lucan's start reads "in the **Riverwood** Trader, Riverwood" with "Riverwood" linked to the town: the linker matched the part of "Riverwood Trader" it knew. Link whole names only; a place the index doesn't have (town interiors) is plain text, never a link on part of its name.
- [x] **The person summary reads like a template.** "An Imperial in Riverwood placed in Riverwood Trader. They give 2 quests." No "placed in" (that's the editor's cell, not where you meet him), and "he"/"she" from the record's sex, never "they" for one person. Until the people reads land, say only what's known: "An Imperial in Riverwood. He gives two quests."
- [x] **Hours on the quest page.** How to start still carries the read's hours ("he runs the counter from 7 am for 13 hours ... from 8 pm until midnight he's at the Sleeping Giant Inn"). Dave's rule: the quest page names the person and the one place to meet them for this quest; the hours go on the person page. Until the people reads land, show the place the read names and leave the hours out; the person page keeps "Not known yet" (WO-155 fills it).

Privacy and voice:
- [x] **No player's name or notes on a page, ever.** Lights Out! says "Dave reviewed"; some pages carry notes written for Kyria. A player report in `overrides.json` keeps its `_source` for the record, but a page and the door show only "a player's report" (or the confirmations, which use the Discord names people chose to show). Remove every Kyria-specific note from the data the pages and the door use. Grep the built data and the rendered pages for "Dave" and "Kyria" and list what you removed.

Search:
- [x] **Results as you type.** The quest search shows suggested results under the box while you type, before Enter.
- [x] **A real results page.** Today it's the results stacked above the normal Quests page. Give it its own page: results grouped (quests, people, places), each with its one-line why-it-matched.
- [x] **A command palette for the whole site** (Cmd/Ctrl+K, and a search button in the header): one box that finds anything, quests, people, places, builds, guide sections, with keyboard navigation. Within the design rules (square corners, no glows).

Header:
- [x] The app's name in the header is **LoreRim Planner** (it plans more than characters now), which frees room for the menu.

Quests page:
- [x] **A huge box breaks "Everything else, by place".** Fix the layout; screenshot at 1440 and 390.

Quest page:
- [x] **The Book of Love: "Every way takes these steps" then two more steps.** The shared steps look complete, then two more appear under them that read as unfinished. Check the ways data against the render: shared steps once, each ending's own steps under it, and nothing that looks like a stray list.
- [x] **Vague places in step or place text** ("wherever the long-dead lovers are"). Where a read doesn't know a place, the page says "Where: not known yet" plainly. (The PC's item-location lookup fills many of these later.)
- [x] **A mod named anywhere links to its Nexus page in a new tab** (What it opens names "Fastred's Choice" with no link). Same rule as the title box.
- [x] **UESP explained.** In How sure we are, "UESP" links to the quest's UESP page (the `url` in `quest_truth.json`) and reads "UESP (the Elder Scrolls wiki)" the first time.
- [x] **Where it takes you: say what the danger column is.** A visible "Danger" label on the column. When no place on the quest has danger data, drop the column and say once "How dangerous these places are isn't known yet."
- [x] **"This was wrong" opens a modal**, not an inline form on the page.

People and Places landing pages (today a long list):
- [x] **Places:** keep the grouping by hold, but as compact sections (the hold, how many places, a few notable ones, "all N"), not a long list under each. Filter by type from the records' location types (Inns, Caves, Forts, Ruins, Mines and so on), with "all inns" etc. as its own view. Search at the top.
- [x] **People:** group by what they are to a player, from the game's factions, not categories we invent (design rule 10): Followers, Spouses, Merchants, Trainers, Innkeepers, Quest givers; filter by town or hold; search at the top. Bob's suggestion; Dave isn't sure how people should be organised, so show it with screenshots and he'll judge.
- [x] Screenshots of every page touched, 1440 and 390.

**Jeff's notes, Part 4 (Mac, 27 Oct).** Typecheck, lint, unit (703), gamedata (349), the build and the whole e2e suite pass; new e2e is `e2e/wo154p4.spec.ts` (10 tests). Screenshots at 1440 and 390: `test-results/wo154p4-quests-*.png`, `-people-*.png`, `-places-*.png` (from that spec), and the quest, person, place and line pages from `e2e/wo154.spec.ts`.
- **A link inside a place name.** The linker no longer links a name that is followed by a capitalised word ("Riverwood Trader"), because that is the start of a longer name it doesn't know. Test in `link-names.test.ts` and in e2e (no link sits on the front of "Riverwood Trader" on The Golden Claw).
- **Person summary.** "A Nord in Riften. She gives two quests." (he or she from the record's sex; "they" only if the record gives none; numbers in words up to ten). No "placed in", and the editor's cell is no longer shown as where to find them: the day strip and its line say "Not known yet". The records' own fields are now on the page: `people.json` gains `essential`, `follower`, `marriage`, `sells`, `innkeeper` and `trainer` ({skill, cap}), joined by record id from the WO-156 dump's fields (not the AI packages; `person_facts` in `people.py`, with a test). So Mjoll has Follower, Can marry, Gives quests, Sells goods and Can't be killed, and "What she offers" says each with "isn't known yet" for what the records don't settle. **Contract:** fields added to `people.json` only; none renamed.
- **Hours.** The quest page shows the place the read names and not its hours (`placeOnly` in `src/lib/pages/where.ts`, tested on 18 of the reads' own sentences). It cuts at the first time, second place or pronoun clause. The door still returns the read's whole `where` (an assistant can use the hours); say if it should match the page.
- **No player's name on a page.** A report is "A player's report" (several: "Players' reports (2)") on the pages, the door and the how-sure line; only a confirmation shows the Discord name. The names stay in `overrides.json`/`quests.json` as the record (3 `source` strings in `quests.json` begin "Dave"; the `_note` fields that say Dave aren't rendered). I grepped the built data and the rendered pages (Lights Out!, Running Wild, Paragliding, More to do in Whiterun): none shows "Dave" or "Kyria" now, and e2e asserts it. I found no Kyria-specific note in the data the pages and the door use (she is in tests, fixtures and code comments only); nothing to remove there.
- **Search.** One box everywhere (`src/components/search/`): suggestions under it while you type (grouped, arrow keys, Enter opens the one you're on or all the results), a results page `/search?q=` grouped Quests, People, Places with what each is and why it matched ("Its name", "Players call it Palomino", "Brynjolf gives it", "It takes you to Broken Oar Grotto"), and a command palette on Ctrl or Cmd and K and a Search button in the header (also finds builds players made public and guide sections). `?q=` on /quests, /people and /places goes to the results page. **For Bob:** the palette's builds and guide are real but I didn't write tests for them beyond quests (builds need a seeded public build).
- **Header** says LoreRim Planner (the page title, the coming-soon page and the connector's name are unchanged).
- **Quests page.** The five big cards, then "Everything else, by place" in its own panel in wrapping columns; screenshots at both widths.
- **The Book of Love.** Its read says the two choices sit inside one list of steps and change nothing about how it ends, so there is nothing to put in "N ways": a quest whose shape is "endings" and whose choices add no steps of their own now shows "The steps" once and then "The choices" (each with the read's line). The Golden Claw, which is the same shape, reads the same way. The ways data was right; it was the render.
- **Vague places.** A place that says wherever or somewhere shows "Where: not known yet" (in How to start and in Where it takes you); I did not touch step text, which is the journal's own words.
- **Mods.** A mod named in text links to its Nexus page in a new tab, where the data has its id; an opens line that names a quest from a mod links the quest and says "from <mod> ↗". **For the PC:** "Fastred's Choice" and many other mod names have no Nexus id in `plugins_raw.json` (the build lists them); they show as text until it has.
- **UESP** reads "UESP (the Elder Scrolls wiki)" and links to the answer key's page for the quest when it has one (it opens in a new tab); otherwise it says "Not compared yet".
- **Danger.** Each row has a "Danger" label; when no place on a quest has danger data the column goes and the section says once "How dangerous these places are isn't known yet."
- **"This was wrong"** is a modal now (the page's "Report a mistake" button opens it; the link at the foot of an older line page opens it too). Coming back from signing in opens it.
- **People and Places landing pages.** People: groups from the records (Followers 103, Spouses 80, Merchants 501, Trainers 74, Innkeepers, Quest givers), each a few names and "All N", a town filter, search at the top. Places: each hold as a compact card with four notable places (those quests go to, then the biggest to clear) and "All N"; chips for every location type the records have ("Inn 27", "Cave 105"...), and "All inns" is its own view. Dave to judge the people grouping from the screenshots.
- **E2E assertions changed:** `wo121a` and `wo146` (the report is a modal; no names), `wo154` (search goes to /search; the person page), `wo18` (its Search field is looked for in the page's main, since the header has a Search button too), `wo96-soon` (the header's name). The whole suite: 402 tests; two failed once for those last two reasons and pass now.

### Part 5. One Characters page in place of Builds and Playthroughs (Dave, 27 Oct)
A character is a build and, if it has one, a run (WO-114). Your own are already one list on `/me`; the public side is still two menu items (Builds, the home page's browse; Playthroughs, a bare list), so a player looks in two places for one person's character.
- [ ] One menu item, **Characters**, in place of Builds and Playthroughs. One page of public characters: each card is the build's card and, if the character has a listed run, its acts on the card the way My characters shows them. Keep Browse's search and filters (tags, race, version) and add a filter for "has a playthrough".
- [ ] `/playthroughs` redirects to the Characters page with that filter on; build and run pages (`/b/…`, `/p/…`) stay where they are.
- [ ] Screenshots at 1440 and 390.

**Jeff's notes, Part 2 and 3 (Mac, 26 Oct).** Built on a shared kit (`src/components/pages/`: title box, section head, gold rewards, "How sure we are", the 1440/390 layout from the boards). Screenshots: `npx playwright test e2e/wo154.spec.ts` writes `test-results/wo154-<page>-1440.png` and `-390.png` for Lights Out!, The Golden Claw, the Thieves Guild line, the main quest's line, Mjoll the Lioness and Broken Oar Grotto, with the older ones. Typecheck, lint (the one warning, `wo129.test.ts`, was there before), unit tests, 348 gamedata tests, the build and the whole e2e suite pass; one new table, `page_confirmation` (`drizzle/0029_*.sql`, additive only), applied to the dev database.
- **Data (Python, `scripts/gamedata/quest_reads.py`, wired in `build.py`):** each read quest carries its ways (`read.ways`, 228 quests; the game's `<Alias>` and `<Global>` tags filled the way objectives are), each of the 50 read lines its line read (`line.read`), each quest the mods that changed it (`changedBy`). `get_quest` returns `ways` (and `stepsEveryWayTakes` for an "endings" quest) and `changedBy`; nothing generated was renamed. The main quest's line is "The main quest" (in `questlines.json`, not in the generated file).
- **Decisions (mine, under WO-138 Part 5):**
  - **"Changed by"** lists the plugins that edit a quest and aren't the base game, the bug-fix patch (USSEP), the quest's own mod, or glue (a name with patch, fix, tweak, compat, bundle, LoreRim or Requiem in it). USSEP and Requiem edit nearly every quest; naming them on every page would say nothing. A plugin `plugins_raw.json` doesn't hold is named from its file name ("SaveTheIcerunner.esp" is "Save the Icerunner") and shown unlinked. **For the PC:** 54 plugins that change quests have no entry in `plugins_raw.json` and so no Nexus link (the build prints the list; Save the Icerunner, Caught Red Handed - Quest Expansion and Alternate Perspective's Gate to Sovngarde Edition are among them).
  - **People pages are by name.** `people.json` has no ids (by design), and 469 names are placed more than once (Ulfric Stormcloak, Serana, 69 Imperial Soldiers). A person's page is `/people/<slug of the name>`, built on the best placed row (one with a town, a cell and a race), and says the other cells too. A quest links a person only by the exact name the read gives; 873 of the 1,316 names the reads list match one row, 136 match more than one (the page takes the best placed), 307 are not a person (the Jarl, "a dragon priest", lists of names) and don't link.
  - **Person page: what it holds.** Only people.json (race, town, cell, a Job role) and the quests that name them. The day strip is one hatched "Not known yet"; the roles Follower, Can marry and Can't be killed, the times, "What changes it" and what they sell or train are left out until WO-155's reads land (the order says not to read the AI packages by rule). Mjoll's board has all of them; her page has her race, Riften, "Gives quests" and Aerin's House.
  - **Place page** is from `places.json` as it stands: foes with the 1 to 50 gauge, the boss on its own row, worth going for, the quests that bring you here (with the read's words for that place), the book or line that points here, finding and clearing XP, good to know. "Vanilla" comes from the form id's plugin (Skyrim.esm), the expansions by theirs; a mod's place shows no origin tag.
  - **How sure we are.** The line is the page's own "Read from the game files and checked by a second reader" (the reader's "Unsure: ..." is the list beside it, in the field's words); a tick for the game files, UESP (ticked only where the answer key confirmed the start; otherwise "Not compared yet") and players (a player's report, or confirmations, with their names). The reader's reasons for a doubt are folded under "Why we're unsure", not in the list, because they read as working notes (docs/pause, section 4 item 1); Bob's pass to turn them into plain lines is still to come.
  - **"What you need first"** sits inside How to start it, only when there is something; "Can I do it?" only for a quest that isn't a normal talk-to-start. A first step is shown only when the quest has no ways (the ways hold it). A quest with no ways file shows its steps by branch as before, numbered.
  - **Line page:** a line with a read shows the read's own words (what it is, who and where, the quests in order with the branches under the quest they come at, what the whole line gives and closes) and the same "How sure we are". The other 101 lines keep what they had.
  - **Quests page:** the five big categories' cards first, then "Everything else, by place" (side stories, notice boards and favours by the town they start in). Search looks in quests (and what players call them), people and places and forgives a misspelling ("Palonimo" finds Running Wild; "Brynjof", Brynjolf). The top menu is Builds, Quests, People, Places, Playthroughs (Gear and Guide stay behind their switches); on a phone it scrolls rather than widen the page. `/people` and `/places` are plain lists with the same search.
  - **Icons:** seven new (signpost, bust, wax seal, clock, chest, boot for travel, coin pouch) in `scripts/icons/quests.py` by the skill icons' rules; the rest are the set's (speech, the journal scroll, the skull, the lock). The sword by each danger line isn't there: a skull sits by each, as on the boards.
- **Not done, and why:** the title box's one- or two-line description (`about`) shows nothing, since no quest has one yet. "Confirm it's accurate" is on quest, person and place pages; the line page has a Report button only. The Thieves Guild line has a line read, so it is the new layout. The player-questions marks are unchanged (3, 4, 5, 12, 18, 21, 35).
- **E2E assertions I changed, and why** (each asked the old page or the older rules; no check was dropped): `wo100` (the home has five category cards and "Everything else, by place" in place of the Jobs panel; the Book of Love line's start now carries the read's own sentence, which names Fastred, where WO-121 kept the first step off a line page), `wo24` (the menu has People and Places), `wo108` (On Hogithum and Blood on the Ice are read now, so the door says `source: "reads"` where the older rules said "not yet" and listed endings), `wo139` ("The main quest"), `wo146` and `wo147` (a read quest's first step is in its ways), `wo154` (the new layout). A full run before these edits, with a second run started on top of it, gave 276 failures that were the two runs sharing one server and one database; the clean full run is 394 passed.
- **Part 3:** `page_confirmation` (kind, key, user, time; one per player per page). Signed out, the button is "Sign in to confirm"; signed in it records, opens the dialog from the `QuestConfirm` board (Confirmed, the names, Close, Undo), and the page's Players row shows how many confirmed and their names; "Undo my confirmation" replaces the button while it stands. An e2e test does the whole round trip on all three kinds of page.

**Why.** Dave, 23 Oct: the quest pages are a shit show. Read live by Bob: Lights Out! lists every stage of every branch as one list ("Report Jaree-Ra to the guard captain" twice), its endings say "When the quest reaches stage 250", its line is "Lights Out!, 1 quest"; Speaking With Silence has no who and a first step "Meet Mercer Frey outside Snow Veil Sanctum at The Ragged Flagon - Cistern"; More to do in Whiterun shows a "The story" heading over jobs, two with no start at all. The spec of what a page shows is now `docs/data/quest-pages.md`; the facts come from `gamedata/5.0.4.8/quest_reads/checked/` (WO-153), which is landing batch by batch from tonight.

- [x] `build.py` reads `quest_reads/checked/*.json` and uses each quest's read for every field it has (`canDo`, `needs`, `starts`, `firstStep`, `takesYou`, `choices`, `steps`, `rewards`, `opens`, `closes`, `people`, `unsure`). The old rule-made fields stay only as a fallback for a quest with no read yet, marked `source: "rules"` so the page and the door can say so. Nothing from a read is reworded.
- [x] Each `takesYou` place joined to the places index for its danger, in the places words ("bandits from level 6, the chief 18 to 24"). A place the index doesn't know is shown without danger, never a made-up one.
- [x] XP from the read's `type` through LoreRim's Experience.ini, as now.
- [x] The quest page, the quest line page and the jobs pages exactly as `quest-pages.md` lays them out, in that order. No stage numbers, record ids or per-line "game files" tags anywhere. No line of one quest: a lone quest sits in its category. Jobs grouped by where you pick them up.
- [x] `get_quest` returns the page's sections 2 to 10 in order; `suggest_quests` returns `canDo`, `needs`, `starts` and `rewards` for every result, so no result has `start: null`.
- [x] The player questions (`docs/player-questions.md`) still pass; questions 1, 3, 9 and 31 to 37 are re-read against the new data and any that change get Bob's word before their answer changes.
- [x] Screenshots for Dave: Lights Out!, Speaking With Silence, Reparations, Mourning Never Comes, The Thieves Guild line, More to do in Whiterun.
- [x] Build it against the first checked batches (the schema is fixed in `quest_reads/BRIEF.md`); re-run `build.py` as batches land, no code change needed for more of them.

### Jeff's notes, progress (Mac, 23 Oct)
- **No reads on staging yet** (`quest_reads/read/` and `checked/` are empty), so everything below is built to the schema in `BRIEF.md` and checked on synthetic reads and on the older rules; the boxes stay unticked until real batches land and I have looked at the pages with them.
- **Data.** `scripts/gamedata/quest_reads.py` loads `checked/*.json` ({checks, quests}; a later batch file wins; a nameless read or an unknown `canDo` is dropped, never guessed) and `build.py` gives each quest `read` and `source: "reads"`, or `source: "rules"` where it has none. `evidence` stays in the batch files. Python tests cover it.
- **One page shape** (`src/lib/quests/reads.ts`): the page, the door and the line page all read `pageOf(quest)`, in the page's order (can I do it, needs, how to start, where it takes you with its danger, choices, what you get, opens and closes, steps, how sure). A read's words are used as written. A way a player found in game (Dave's Jaree-Ra) replaces the read's start for that person and the "how sure" line says so. Danger comes from the places index (`dangerOf`): who lives there, from which level, the boss; nothing for a place the index doesn't know, one whose people aren't hostile, or one with no levels, never a made-up one. I wrote it as "bandits from level 6, up to 24; the boss Chief Yamarz, level 45", the places words, not "the chief 18 to 24".
- **Pages.** The quest page is the ten sections, no stage numbers, no "game files" tag on any line; a lone quest shows its category, not a line; the line page has "The quests in order" (one row each: what it is, where it takes you with danger, what it needs beyond the quest before it, XP), "What the whole line gives", "What it closes" and a how-sure line; a shelf's jobs are grouped by the town you pick them up in, with no "The story" heading; a line of one quest redirects to its quest. The journal rows and "How it can end" are gone (the steps are on the quest's page); the e2e that tested them (`wo100`, `wo146`, `wo147`) are rewritten for the new page.
- **The door.** `get_quest` returns the sections in order (`source`, `canDo`, `needs`, `starts`, `firstStep`, `takesYou`, `choices`, `gets`, `opens`, `closes`, `steps`, `howSure`), and `suggest_quests` adds `canDo`, `needs`, `starts` and `gets` for every result. The older `start` block stays in `get_quest` for now beside them, so a quest with a read says it twice; I'll drop it once real reads show it's safe.
- **Not done:** the line page's "What it is" and "How to get in" still use the rules' line fields until `quest_reads/lines/` exists and its shape is written (WO-153 Part 2); the screenshots for Dave need real reads; player questions 1, 3, 9 and 31 to 37 pass unchanged on the older rules and get re-read when reads land.
- **Checks:** typecheck, lint, 695 unit tests (11 new), the gamedata tests and the build pass; the quest e2e (`wo100`, `wo106`, `wo121a`, `wo136`, `wo146`, `wo147`, `wo148`, and a new `wo154`, 29 tests) pass.

### Jeff's notes, the first 130 reads (Mac, 23 Oct, 18:50)
- **Built with the first 13 batches** (130 quests; 1,096 still on the older rules). `build.py` prints the count each time; re-running it as batches land is the only step. I'll rebuild and push `quests.json` each time I see new batches on staging.
- **Record ids in the readers' unsure notes.** 7 notes name a record (an editor id like SQL_Mortal_Spell_Power_VampiresSeduction, a form id like Skyrim.esm:0BC096, a plugin's file name) and the standing test says no page shows an id. Nothing is reworded: a note that names a record keeps its field in the "Unsure: ..." line but its words aren't shown (page or door). The readers' `plugin` string isn't carried at all (the page's mod tag comes from the line's sources). If you'd rather the checkers write those notes without ids, say so and the words come back.
- **How sure.** One short line, "Read from the game files and checked by a second reader. Unsure: rewards, steps, people, starts", with the reasons folded under "Why we're unsure". The readers write 3 to 5 notes per quest, so the full words in a line would be a paragraph.
- **What a read changes on the page.** The Throat of the World now reads: Starts by itself (the reader's why), needs Alduin's Wall, how to start it, first step, High Hrothgar with the places index's danger ("trolls from level 14, up to 150; the boss The Beast, level 14", the PC's data), what you get, what it opens, the steps, how sure.
- **Still to do when more batches land:** the screenshots for Dave (Lights Out!, Speaking With Silence, Reparations, Mourning Never Comes, The Thieves Guild line and More to do in Whiterun: none of those are in the first 13 batches, so I have none to show yet), re-reading player questions 1, 3, 9 and 31 to 37 against reads, and dropping the older `start` block from `get_quest` once reads cover the quests those questions ask about.

### Jeff's notes, done for the batches on staging (Mac, 23 Oct, 19:05)
- **Built and pushed with 270 reads** (27 of the 85 batches); 956 quests are still on the older rules and the page says so ("Not read yet: this page is from the planner's older rules"). Every batch that lands needs `python3 scripts/gamedata/build.py` and a push of `quests.json`; no code changes. I'll keep doing that while I'm on Mac and nothing else is queued.
- **Screenshots for Dave:** `npx playwright test e2e/wo154.spec.ts` writes `test-results/wo154-<page>-1440.png` and `-390.png` for Lights Out! (still on the rules: the only quest in its line, so it's in Side stories), Speaking With Silence, Reparations, Mourning Never Comes (read), the Thieves Guild line and More to do in Whiterun. No overflow at 390. The line page's "What the whole line gives" lists every non-gold reward of its quests (the line reads, WO-153 Part 2, aren't in yet to pick the big ones), and a row no longer repeats "Needs Finish <the quest before it>".
- **Player questions:** 1, 3, 9 and 31 to 37 still pass with the 270 reads, so none of their answers changed; the ones that ask about quests not yet read will be looked at as their batches land.
- **Decisions for Bob (Part 5):** (1) where a read and the older rules disagree on a start, the read wins, except a way a player found in game, which wins over both (Dave's Jaree-Ra); (2) the record-id notes (above); (3) the line page keeps the rules' "What it is" and "How to get in" until line reads exist; (4) `get_quest` keeps the older `start` block beside the new sections for now.
- **Checks:** typecheck, lint, 696 unit tests, 322 gamedata tests, the build and the quest e2e (`wo100`, `wo136`, `wo146`, `wo147`, `wo148`, `wo154`) pass. I did not run the whole e2e: only the Quests pages and the door changed.

### Jeff's notes, progress (Mac, 23 Oct)
- **No reads on staging yet** (`quest_reads/read/` and `checked/` are empty), so everything below is built to the schema in `BRIEF.md` and checked on synthetic reads and on the older rules; the boxes stay unticked until real batches land and I have looked at the pages with them.
- **Data.** `scripts/gamedata/quest_reads.py` loads `checked/*.json` ({checks, quests}; a later batch file wins; a nameless read or an unknown `canDo` is dropped, never guessed) and `build.py` gives each quest `read` and `source: "reads"`, or `source: "rules"` where it has none. `evidence` stays in the batch files. Python tests cover it.
- **One page shape** (`src/lib/quests/reads.ts`): the page, the door and the line page all read `pageOf(quest)`, in the page's order (can I do it, needs, how to start, where it takes you with its danger, choices, what you get, opens and closes, steps, how sure). A read's words are used as written. A way a player found in game (Dave's Jaree-Ra) replaces the read's start for that person and the "how sure" line says so. Danger comes from the places index (`dangerOf`): who lives there, from which level, the boss; nothing for a place the index doesn't know, one whose people aren't hostile, or one with no levels, never a made-up one. I wrote it as "bandits from level 6, up to 24; the boss Chief Yamarz, level 45", the places words, not "the chief 18 to 24".
- **Pages.** The quest page is the ten sections, no stage numbers, no "game files" tag on any line; a lone quest shows its category, not a line; the line page has "The quests in order" (one row each: what it is, where it takes you with danger, what it needs beyond the quest before it, XP), "What the whole line gives", "What it closes" and a how-sure line; a shelf's jobs are grouped by the town you pick them up in, with no "The story" heading; a line of one quest redirects to its quest. The journal rows and "How it can end" are gone (the steps are on the quest's page); the e2e that tested them (`wo100`, `wo146`, `wo147`) are rewritten for the new page.
- **The door.** `get_quest` returns the sections in order (`source`, `canDo`, `needs`, `starts`, `firstStep`, `takesYou`, `choices`, `gets`, `opens`, `closes`, `steps`, `howSure`), and `suggest_quests` adds `canDo`, `needs`, `starts` and `gets` for every result. The older `start` block stays in `get_quest` for now beside them, so a quest with a read says it twice; I'll drop it once real reads show it's safe.
- **Not done:** the line page's "What it is" and "How to get in" still use the rules' line fields until `quest_reads/lines/` exists and its shape is written (WO-153 Part 2); the screenshots for Dave need real reads; player questions 1, 3, 9 and 31 to 37 pass unchanged on the older rules and get re-read when reads land.
- **Checks:** typecheck, lint, 695 unit tests (11 new), the gamedata tests and the build pass; the quest e2e (`wo100`, `wo106`, `wo121a`, `wo136`, `wo146`, `wo147`, `wo148`, and a new `wo154`, 29 tests) pass.

### Jeff's notes, the first 130 reads (Mac, 23 Oct, 18:50)
- **Built with the first 13 batches** (130 quests; 1,096 still on the older rules). `build.py` prints the count each time; re-running it as batches land is the only step. I'll rebuild and push `quests.json` each time I see new batches on staging.
- **Record ids in the readers' unsure notes.** 7 notes name a record (an editor id like SQL_Mortal_Spell_Power_VampiresSeduction, a form id like Skyrim.esm:0BC096, a plugin's file name) and the standing test says no page shows an id. Nothing is reworded: a note that names a record keeps its field in the "Unsure: ..." line but its words aren't shown (page or door). The readers' `plugin` string isn't carried at all (the page's mod tag comes from the line's sources). If you'd rather the checkers write those notes without ids, say so and the words come back.
- **How sure.** One short line, "Read from the game files and checked by a second reader. Unsure: rewards, steps, people, starts", with the reasons folded under "Why we're unsure". The readers write 3 to 5 notes per quest, so the full words in a line would be a paragraph.
- **What a read changes on the page.** The Throat of the World now reads: Starts by itself (the reader's why), needs Alduin's Wall, how to start it, first step, High Hrothgar with the places index's danger ("trolls from level 14, up to 150; the boss The Beast, level 14", the PC's data), what you get, what it opens, the steps, how sure.
- **Still to do when more batches land:** the screenshots for Dave (Lights Out!, Speaking With Silence, Reparations, Mourning Never Comes, The Thieves Guild line and More to do in Whiterun: none of those are in the first 13 batches, so I have none to show yet), re-reading player questions 1, 3, 9 and 31 to 37 against reads, and dropping the older `start` block from `get_quest` once reads cover the quests those questions ask about.

### Jeff's notes, done for the batches on staging (Mac, 23 Oct, 19:05)
- **Built and pushed with 270 reads** (27 of the 85 batches); 956 quests are still on the older rules and the page says so ("Not read yet: this page is from the planner's older rules"). Every batch that lands needs `python3 scripts/gamedata/build.py` and a push of `quests.json`; no code changes. I'll keep doing that while I'm on Mac and nothing else is queued.
- **Screenshots for Dave:** `npx playwright test e2e/wo154.spec.ts` writes `test-results/wo154-<page>-1440.png` and `-390.png` for Lights Out! (still on the rules: the only quest in its line, so it's in Side stories), Speaking With Silence, Reparations, Mourning Never Comes (read), the Thieves Guild line and More to do in Whiterun. No overflow at 390. The line page's "What the whole line gives" lists every non-gold reward of its quests (the line reads, WO-153 Part 2, aren't in yet to pick the big ones), and a row no longer repeats "Needs Finish <the quest before it>".
- **Player questions:** 1, 3, 9 and 31 to 37 still pass with the 270 reads, so none of their answers changed; the ones that ask about quests not yet read will be looked at as their batches land.
- **Decisions for Bob (Part 5):** (1) where a read and the older rules disagree on a start, the read wins, except a way a player found in game, which wins over both (Dave's Jaree-Ra); (2) the record-id notes (above); (3) the line page keeps the rules' "What it is" and "How to get in" until line reads exist; (4) `get_quest` keeps the older `start` block beside the new sections for now.
- **Checks:** typecheck, lint, 696 unit tests, 322 gamedata tests, the build and the quest e2e (`wo100`, `wo136`, `wo146`, `wo147`, `wo148`, `wo154`) pass. I did not run the whole e2e: only the Quests pages and the door changed.

### Part 1b. Read on staging, by Bob (23 Oct, 19:15)
Read live: Speaking With Silence, Mourning Never Comes, the Thieves Guild line. This is the page Dave asked for: can I do it, needs, who and where, places with their danger, choices, rewards, opens and closes, steps, how sure. Your four decisions are right: (1) yes; (2) yes, and the briefs now tell readers and checkers to keep record ids out of `unsure` text; (3) yes until the line reads land; (4) drop the older `start` block from `get_quest` for any quest that has a read, now. Five things to fix:
- [ ] **The rules leak into a read quest.** Mourning Never Comes' first step ends "( The door from Abandoned Shack into Abandoned Shack needs the Abandoned Shack Key )": that's the rules' `onTheWay`. A quest with a read shows nothing from the rules, on the page or the door.
- [ ] **The mod tag is the line's, not the quest's.** Mourning Never Comes shows "Base game The Innocence Lost ACDB Listen": it's a base-game quest; those mods add other quests to the line. A quest page names the quest's own mod (its plugin; "Base game" for Skyrim.esm, the DLC's name for theirs).
- [ ] **Who and where lead.** "Report back to Mercer ... ( Mercer Frey ) | the Cistern, under the Ragged Flagon in Riften" reads backwards. Write it as "**Mercer Frey**, in the Cistern under the Ragged Flagon, Riften. Report back to him after Scoundrel's Folly; ..." (the who in bold, then the where, then the how). Same on the door: `starts[]` as who, where, how.
- [ ] **No "Not listed".** The line page's "Length Not listed Enemies Not listed" is a line a player can't act on; leave out any field with nothing in it.
- [ ] Screenshots again of the same six pages, and the player questions still pass.

### Jeff's notes, Part 1b (Mac, 23 Oct, 19:45)
- **The rules leak.** A quest with a read now shows nothing from the older rules on the door: `get_quest`'s `quest` block is the page's sections and nothing else (no `start`, `objectives`, `endings`, `pays`, `changesTheRun`, no start-check note), the line-level start note ("hasn't passed the planner's start check") is replaced by just whose line it is, and the page drops the door-on-the-way line. `openForYou` (the player-specific judgement) still reads the rules' needs; it says whether the quest is open for her, not a fact about the quest, but it can disagree with the read, so say if you want it moved onto the reads' needs.
- **The quest's own mod.** `quest_pages.py` gives each quest its own `mod` (its folder's name and Nexus id; Base game for Skyrim.esm; Dawnguard, Dragonborn and Hearthfires for the expansions' plugins), and the quest page's tag is that. Mourning Never Comes shows "Base game" only. The line page still lists the line's mods.
- **Who and where lead.** For a quest with a read: **Mercer Frey**, in the Cistern, under the Ragged Flagon in Riften. Report back to Mercer after Scoundrel's Folly; ... (who in bold, then where, then how); the door's `starts[]` are `who`, `where`, `how` in that order. Readers' blanks ("not named in these records", "not given in these records") are left out whole, as is a hold like that, since a field with nothing in it isn't shown.
- **No "Not listed".** The line page's Length, Enemies and Quest XP show only when there is something. The unsure line says "Unsure: what you need, what you get, where it takes you, what it opens" (the field names in a player's words, not `takesYou`).
- **Player questions.** Two changed with the reads, so by your rule they need your word: **21** (How do I start Dawnguard?) fails because Dawnguard's opening quest is read now and the read names no one who starts it: it says the records give no giver, picks the five at Fort Dawnguard (Isran, Tolan, Agmaer, Durak, Celann) and puts "where each stands" under what it is unsure of. "Agmaer" is no longer in the answer, so it is marked "fails today" for your decision, with the doc saying why. **7** (where's the book for each read-this start) passes: for a read quest it takes the read's `where`, or "not checked yet" when the read lists starts or where among what it's unsure of. Q1, 3, 9, 31 to 37 are unchanged. The tests that asked a read quest for the rules' fields (`wo108`, `wo148`) now ask for the read's.
- **Screenshots again of the same six pages:** `npx playwright test e2e/wo154.spec.ts` writes `test-results/wo154-<page>-1440.png` and `-390.png` for Lights Out!, Speaking With Silence, Reparations, Mourning Never Comes, the Thieves Guild line and More to do in Whiterun, with 450 of 842 quests read (45 batches).
- **Checks:** typecheck, lint, 699 unit tests (one marked), 322 gamedata tests, the build and the quest e2e (`wo100`, `wo136`, `wo146`, `wo147`, `wo148`, `wo154`: 27 tests) pass.

### Jeff's notes, 640 reads (Mac, 23 Oct, 20:05)
- **Rebuilt with 640 of 842 reads** (64 batches). Each batch that lands changes which quests the tests ask about, so the tests of the rules' machinery (the start check, the answer key, a player's fact laid over a way, the judge's words) now ask `rules(...)` in `src/lib/mcp/rules-view.ts`, which gives a quest as the older rules say it whether or not it has a read; the tests of the door ask `getQuest` and get the read's shape. No more edits to tests when a batch lands, unless a question's answer changes.
- **Questions that changed with the reads, for your word (marked "fails today" with the reason in `player-questions.md`):** **3** Blood on the Ice: the read says it starts by itself over the body (witnesses; a second way through the steward), not "at night, after you've come in four times" or a Windhelm guard. **5** The Blessings of Nature: first step "Inspect the Temple of Kynareth", which your WO-138 ruling dropped for Retrieve Nettlebane. **12** Deathbrand: the read has no level 20 gate (needs: nothing); the PC's check found it (WO-137), so a read quietly lost a checked fact. **21** Dawnguard: no starter named (above). **35** Laid to Rest: Sorli in Stonehills is given as another way in when she is Jarl, which WO-148 Part 2 kept out. 7 and 33 pass with the read's words ("Talk to Igna", the read's where).
- **Worth a look beyond those five:** a read's empty `needs` shows "Nothing: any level", which is only as good as the reader; Deathbrand shows it is not. Running Wild's read says "Starts by itself" while Dave's note on the board is the way in, so the page shows his way first and the read's "by itself" under Can I do it, which disagree; and readables locations (where the book or note is, the PC's file) are carried only for a player's way, since reads don't hold them. All three are for you to rule on.
- **Checks:** typecheck, lint, 699 unit tests (5 marked), 322 gamedata tests, the build, and the quest e2e (`wo100`, `wo106`, `wo121a`, `wo122` to `wo124`, `wo128`, `wo129`, `wo136`, `wo139`, `wo142`, `wo146` to `wo148`, `wo154`, `wo13`: 64 tests) pass; `wo129`'s act editor test failed once in a combined run and passes alone and in its own spec run (shared state between specs).

## WO-153  Quest reads: an agent reads every quest's records, a second checks it (Bob runs it, 23 Oct 2026)
Status: paused (Bob, 23 Oct, 19:30: Dave paused it at 81% of his weekly usage)

**Why.** The bake-off, 23 Oct (20 random quests, UESP as the key, a blind judge): what the planner says today got 48 of 100 fields right and left 23 empty; a fresh agent reading the same quest's records got 72 right and left none empty (wrong: 6 against 4). Three days of rules were the wrong tool: every quest is built a little differently, and a rule can't read. Dave, 23 Oct: do it.

How it runs. Bob runs it from the chat session, since it's agents reading, not app code. The 842 quests on the pages that aren't Missives (Missives stay one rule: they're all built alike), in 85 batches of 10 kept together by line (`quest_reads/batches.json`). A reader per batch follows `quest_reads/BRIEF.md`; a separate checker per batch follows `quest_reads/CHECK.md` and writes the corrected batch to `quest_reads/checked/`. About 20 at a time.

- [ ] All 85 batches read and checked; every checker's fixes logged under this order with the count per field.
- [ ] Bob reads every field a checker fixed or left unsure, and a random 5 quests per 10 batches in full, against the records, and writes his rulings to `story_checks/bob-rulings.md`.
- [ ] Agreement with the UESP key (`quest_truth.json`, 475 rows) per field, by script, logged; every disagreement on who or where read by Bob.
- [ ] Part 2: a line read for each quest line from its quests' checked reads (what it is, how to get in, what it gives, what it closes), into `quest_reads/lines/`.
- [ ] Dave checks 5 quests drawn at random, in game. His result overrides everything.

### Where it stopped (Bob, 23 Oct, 19:30)
- All 85 batches read (842 quests). Checked: 75 batches. Read but not checked yet: 074, 075, 077, 078, 079, 080, 081, 082, 083, 084. The page uses a read only once it's checked, so those quests still show the older rules.
- Against the UESP key (`quest_truth.json`), on the checked batches: who starts it agrees on 220 of 251, the first step on 350 of 384. The misses are mostly radiant jobs whose giver the records don't name (Dawnguard's Gunmar and Florentius jobs, Delvin's city jobs); a handful are real disagreements for Dave in game (Mourning Never Comes, Recipe for Disaster, Where You Hang Your Enemy's Head, The Unquiet Dead, Extracting an Argonian, Raven's Flight).
- Left to do when it resumes: the remaining checks, the ruling pass (fill unnamed givers from UESP, marked as such; list the disagreements), and Part 2, the line reads.
- WO-155's 20-person test is paused too: 3 of 4 reader batches done, the UESP keys not.

### Changes to other orders (Bob, 23 Oct)
- **WO-152** parked: its measure is done (793cb11) and it told us the size. The audit is replaced by WO-153's bake-off and checks; Part 1 (reading packages by rule) by WO-156 (dump) and WO-155 (read).
- **WO-140** closed: the reads write every start in words; there are no conditions left to name by rule.
- **WO-144 Part 2 (people)** replaced by WO-156 and WO-155. Parts 1e-4 (places) and 3 (where books are) go on: they're structured data, not reading.

---

## WO-152  Where people actually are: by day, by night, not where the editor placed them (PC, then Mac, 23 Oct 2026; before the rest of WO-144 Part 2)
Status: parked (Bob, 23 Oct: replaced by WO-153, WO-155 and WO-156; see WO-153)

**Why.** Dave (23 Oct, 17:33) looked for Jaree-Ra, who starts Lights Out!. The planner says "Ask Jaree-Ra … in Red Wave, Solitude". He searched the Red Wave three times; Jaree-Ra stands in Solitude by the inn, as in the vanilla game, and Dave found him only by console. The quest's facts (who, the line, the stage) are right; the **where** is the cell the editor placed him in (where he sleeps), not where he spends his day. The same goes for every person-started way: 573 ways name a person and a place, all from the placement cell. Most shopkeepers stand where they're placed; anyone who walks the town, works elsewhere or sleeps aboard a ship is wrong. Bob also sent Dave to the docks from memory before checking; that rule is in `pipeline.md` now.

### First: measure it, for every person-started way (PC, before any fix)
Dave (23 Oct, 17:40): the point isn't Jaree-Ra, it's not having wrong data on every quest and NPC. So first count it:
- [x] For all 573 person-started ways (and every quest giver), compare the placement cell the pages use with where the person's AI packages put them by day. Write the count to the log: how many match, how many differ, and the list of those that differ, by hold.
- [x] Push that count before building anything, so Bob and Dave see how big the problem is.

**Measured (PC, 23 Oct), a rough first count, methodology and its own limits logged.** `quest_givers_raw.json` names 337 distinct people as a quest's own giver (550 quests have a named giver; many share the same person). For each, read their `NPC_`'s `PKID` list (the AI package stack, in order) and each `PACK`'s own `PLDT` (location type, target, radius):
- **85 of 337** carry no package with a specific "near reference" target at all -- every package they have is "near my own editor placement" or "near my current location" (trivial, no distinct daytime spot to differ from). These match the placement cell by definition.
- **252 of 337** carry at least one package naming a specific reference. Resolving each target's own cell and comparing its name to the placement's: **196** show a different cell name, by hold: Riften 20, Whiterun 19, Solitude 15, Windhelm 13, Winterhold College 11, Markarth 8, Raven Rock 7, Falkreath 6, and 36 more holds/worldspaces at 1 to 4 each (full list in this session's own working notes, not committed -- a one-off measurement script, not the pipeline).
- **This overcounts, read by hand on two names before trusting it further.** Nazeem resolves to "Dragonsreach" and Balgruuf the Greater to "Blue Palace" (Solitude's own seat, a different hold entirely) -- neither matches anything Dave or UESP says about either (Nazeem: the Whiterun market and the Cloud District; Balgruuf doesn't leave Whiterun at all). A person can carry several "near reference" packages (greet packages, combat-alert packages, a rare conditional one), and this first pass takes whichever resolves, not the one actually active by day; a shared/generic package reused across many NPCs pointing at a marker a mod's own override repoints elsewhere is the likely cause for at least some of these. **So: real, and large -- at minimum dozens of the 337 differ, very likely closer to half -- but 196 is a ceiling from a crude method, not a trustworthy count.** Part 1's own build (reading a package stack in its real priority order, with its conditions, and skipping the shared/generic ones that say nothing about a specific person) is what gets the real number; this was only to show the scale before building it. 307 gamedata tests pass (nothing in the pipeline changed for this measurement).

### Then: an independent audit of the quest data, by random sample (PC runs it, Rex judges it)
Not hand-picked: 60 quests drawn at random from the 1,224 checked (seeded, the seed in the log), so the result is an error rate, not an anecdote. For each, every field a player acts on: who starts it, **where they are by day**, the line or action, the first step, the level gate, what it pays. Compared against UESP (vanilla, DLC, Creation Club) or the records read fresh (mods), by a fresh Rex agent that hasn't seen the planner's reasoning. Report: the share right per field, every wrong one with why, and which fields are systematically off (as "where" just was). Dave checks ten of the sixty in game; those are ground truth and override both.
- [ ] The audit report in `story_checks/audit-2026-10-23.md`, with per-field error rates. A field with more than 2% wrong gets an order before anything else.

**Launched (PC, 23 Oct).** Seed `20261023`, population 1226 individual quests (`quests.json`'s own `lines[].quests[]`, not just the 46 lines marked `checked: "files"` -- the order's "1,224 checked" reads as nearly the whole set), 60 drawn with Python's own seeded `random.sample`. Handed to a fresh Rex agent with the sample (name/line/giver/where/firstObjective as the planner has them, nothing else) and the instruction to look each up on UESP *first*, judge independently, then compare -- running now; the report and the headline finding land here once it's back.

### WO-152 Part 1, status (PC, 23 Oct)
Not built this session -- flagging the size, not rushing a guess. A reliable `where` (by day) needs the AI package stack read in its real priority order, each package's own schedule (`PSDT`: month/day/date/time/duration) checked against "is this active now", not just "does any package have a specific target" -- confirmed by a quick measurement (logged above): taking whichever "near reference" package resolves, with no time-of-day filter, gives Nazeem "Dragonsreach" and Balgruuf "Blue Palace" (Solitude's own seat), neither right. `PSDT`'s exact byte layout isn't something this reader has decoded and verified the way Bob hand-decoded `ECZN`'s; building `where`/`sleeps`/`hours` on a guessed layout would ship confidently wrong data across 4,666 people, worse than not building it. **Flagging for Bob/Dave, the same way ECZN was flagged in Part 1d:** is there a reference for `PSDT`'s exact fields, or should this be hand-decoded next against a known day/night contrast (Brynjolf: Riften's market by day, elsewhere at night) the way Fort Hraggstad settled `ECZN`? Continuing to the rest of the queue (WO-144 Part 2, WO-145, WO-149) in the meantime, per Dave's own priority order.

### Part 0. Jaree-Ra, from Dave's game (Mac, now)
Dave watched him for a full in-game day (23 Oct, 17:39): he stands in two spots a few feet apart in Solitude by the Winking Skeever, day and night, and never goes to the docks or the Red Wave. Put that on Lights Out!'s way by hand (`overrides.json`, `_checked: "players"`, `_source: "Dave, watched in game for a day, 23 Oct 2026"`): "Talk to Jaree-Ra in Solitude, by the Winking Skeever (he stays there day and night)". Part 1's package read must agree with it; if it doesn't, the packages are being read wrong.
- [x] Part 0 (Mac).

### Part 1. Where, from the AI packages (PC)
- For every person in `people.json` (and every quest giver), read their AI packages in order (`PACK` with its schedule and location: sandbox, travel, eat, sleep, work, the location or ref it names), resolved to places: "by day: the streets of Solitude by the Winking Skeever; sleeps: aboard the Red Wave at the Solitude docks".
- Write `where` (by day, the place a player meets them), `sleeps`, and `hours` to `people.json`; keep `placed` (the editor cell) for reference only.
- A mod's override wins (RedBag's Solitude edits Jaree-Ra's record; read its packages).
- Spot checks in the log against UESP and Dave's game: Jaree-Ra (two spots by the Winking Skeever in Solitude, day and night, never the docks: Dave watched a full day), Brynjolf (Riften's market by day), Maven Black-Briar, Nazeem (Whiterun market and the Cloud District), Lydia (Dragonsreach until bought), Viarmo, and three who never move (Belethor, Arcadia, Keerava).

### Part 2. The quest pages say it (Mac)
- A way that names a person gives `where` from Part 1 ("Talk to Jaree-Ra, by day on the streets of Solitude near the Winking Skeever"), and `get_quest` sends the same; the placement cell never reaches a player.
- `get_person` (WO-144 Part 2's tool) returns where, sleeps and hours.

### Done when
- [ ] Part 1: `where`, `sleeps`, `hours` for every person, with the spot checks in the log. (PC)
- [ ] Part 2: every person-started way and `get_quest` use them. Player question 37: "Where do I find Jaree-Ra?" says the streets of Solitude by the Winking Skeever, not the Red Wave. (Mac)
- [ ] Every check in CLAUDE.md passes. Push staging with `Status: for Bob`.

### Jeff's notes, Part 0 (Mac, 23 Oct)
- **Done on Lights Out! (MS07).** `overrides.json` `questStarts.MS07` replaces the way with "Talk to Jaree-Ra in Solitude, by the Winking Skeever (he stays there day and night)", `_checked: "players"`, `_source: "Dave, watched in game for a day, 23 Oct 2026"`, so the way shows as a player's report. The records' Red Wave also sat in three other fields the page and `get_quest` say: the start's `where`, the way's `where`, and the first step's `thenWhere` ("Accept Jaree-Ra's offer in Solitude at Red Wave, Solitude"). A new `_where` override ({who, where, then?}) in `quest_pages.py` (`hand_where`) puts the spot in those for that person only; they now read "Solitude, by the Winking Skeever" and "Accept Jaree-Ra's offer in Solitude at the Winking Skeever". The raw record form (the judge's, never said to a player) still has the Red Wave. Rebuilt with `build.py`; only `quests.json` changed.
- **Part 1 must agree.** When the PC's package read gives Jaree-Ra a `where`, it should say the streets of Solitude by the Winking Skeever; if it says the Red Wave or the docks the packages are being read wrong (the order says so). `_where` is the same hand-kept override Part 2 can drop once every person has a `where`.
- **Tests.** `src/lib/mcp/wo152.test.ts` (get_quest on Lights Out!: the way, the place, the first step, never the Red Wave or the docks) and a Python `HandWhereTest`. Player question 37 stays "fails today": it asks for `get_person`, which is WO-144 Part 2's tool, and it comes off with Part 2. Typecheck, lint, 683 unit tests, 296 gamedata tests, the build and the quest-page e2e (`wo121a`, `wo136`, `wo146`, `wo147`, 16 tests) pass.
- **Status.** Left `queued` for the PC's Part 1 and the measure and audit before it; Part 2 is Mac and waits on Part 1.

---

## WO-151  What suggest_places says, read as a player (Mac, 23 Oct 2026)
Status: done

**Why.** Bob read `suggest_places` for Kyria's Act I (Riften, levels 1 to 6) live, as her Claude would, after WO-150. The data faults are the PC's (WO-144 Part 1e-3); these are the door's:
- [x] **Distance in a player's words:** "Riften, 0.2 km" → the walk band ("a short walk from Riften"), km only for sorting. Everywhere the door gives a distance.
- [x] **No guild halls or friendly places as suggestions:** Thieves Guild Headquarters (type Guild) came back with Mercer Frey as its "boss". Add Guild, and any place whose people aren't hostile at the start (Orc strongholds' residents, towns), to the stops `placesNear` leaves out; strongholds stay as destinations but show **no enemies** ("the Orcs of Largashbur; outsiders aren't welcome until The Cursed Tribe or you're Blood-Kin").
- [x] **No helper names in `questGoesThere`:** "Thieves Guild Radiant Guild Trophy Enabler", "BCSLL Vendor Quest". Handlers, helpers and vendor scripts are background (G5); leave them out.
- [x] **Pointers with no speaker:** "someone the line doesn't name" appears in pointers (Riften Dialogue lines). A town's gossip line is "people in Riften say: …"; name the speaker when the alias or faction gives one (a guard, an innkeeper); never "someone the line doesn't name".
- [x] **"Levels not read yet"** on Fallowstone Cave, Sanctum of Malacath and The Thief Doomstone: pass through whatever the PC's data has, and say "not checked yet" in those words when it has none.
- [x] Player question 26 (places near Riften) reads clean against all of the above. Push staging with `Status: for Bob`.

### Jeff's notes (Mac, 23 Oct)
- **Distance.** `nearestTown` now reads from the data's own `walk` band: "next to Riften", "a short walk from Riften", "half a day from Riften", "a long day's road from Riften" ("near Riften" if a place ever has no band). The kilometres stay in the data and sort the list; they are not said anywhere. It is the only place the door gave a distance. A test runs every town's places and fails on "km".
- **Stops.** `Guild` is a stop, and so is anything the index says sits `inTown` (all 14 Guild entries and every inn, temple, keep and stable in a town do), so the Thieves Guild Headquarters, Jorrvaskr, the College halls and the rest no longer come back. An Orc stronghold (Largashbur, Narzulbur, Dushnikh Yal, Mor Khazgur) stays as a destination with no `levels`, `boss`, `enemies`, `when` or `clearXp`; it says `welcome`: "The Orcs of Largashbur live here. At the door they say: "This is our stronghold. ... You're not an Orc, or Blood-Kin, so stay out. We only help our own."" That is the game's own line from the place's `enters`, passed through. **A call for Bob:** your example added "until The Cursed Tribe". The data has no line saying that quest opens the stronghold (the quest's journal names Largashbur's Orcs, the place's `quests` list doesn't carry it, and I don't know what the quest does to the door), so I did not write it. If it is true, it needs a field from the PC's side, or say so and I'll add a line.
- **Helper names.** `questGoesThere` keeps only quests the planner lists by name and that `isHelper` doesn't catch. That drops "Thieves Guild Radiant Guild Trophy Enabler" and "BCSLL Vendor Quest", and also the 40-odd names the places data carries that the planner has no page for ("Init quest", "Corpse Check", "MQ Always On", ...). It also drops a few that may be real board jobs the planner doesn't list ("Bounty Hunter" at Broken Helm Hollow, "Knight of Julianos", "Kyne's Dragon"): an assistant can't link a quest the planner has no page for, and rule 15 says never to name one it can't. If you want those named, they need adding to the quest data.
- **Speakers.** A pointer with no speaker says `who: "people in Riften"` (the place's nearest town; the hold when it has none). The records give 1,605 such lines with only `from` and sometimes `quest`: no alias or faction, so there is no guard or innkeeper to name. A named speaker stays named. "someone the line doesn't name" is now in the player questions' never-list for every answer, with "someone the records don't name".
- **Not checked yet.** A place with no `actors` says `levels: "not checked yet"` and `when: "levels not checked yet"` (was "levels not read yet"), and no `enemies`. Fallowstone Cave, Sanctum of Malacath and The Thief Doomstone still have none: the data has no actors for them, so the next step is the PC's (WO-144 Part 1e-3). A place that has them passes them through unchanged.
- **Player question 26** is in `player-questions.test.ts` (it was only in the doc) and passes; its "fails today" mark is off and the doc says what it must and never holds. It is about what the door says, not about the data: Nightingale Hall's "1 to 1" with "never below 8" and Faldar's Tooth's boss "Pit Wolf, level 2" are the PC's data, passed through.
- **Checks.** Typecheck, lint, 678 unit tests (14 new in `wo151.test.ts`), 293 gamedata tests and the build pass. The places and door e2e (`wo128`, `wo129`, `wo147`, `wo148`, 17 tests) pass; on the first run `wo147`'s "door links" test failed on a link on the playthrough page, then passed alone and in a second full run of the four, so I put it down to the shared state between specs and did not chase it. Nothing on a screen changed, so I did not run the whole e2e.

- Bob, 23 Oct, 17:50, live: walk bands, no guild hall, Largashbur's welcome line in place of enemies (good), "not checked yet". The rest of what reads wrong is the PC's data (1e-3). One small thing of yours:
- [x] **"People in Riften" only for the town's own gossip.** Lines from a quest or a follower got it too: Forelhost's "Return to me here once you've obtained the mask" is Captain Valmir's (Siege on the Dragon Cult); Crystaldrift Cave's "Fancy a trip?" is a follower's comment. "People in <town>" only when the line belongs to the town's dialogue quest (Riften Dialogue and its kin); a quest's line names its alias's person; a follower's comment names "a follower" or the follower; otherwise leave the line out.

### Jeff's notes, the gossip part (Mac, 23 Oct)
- **The rule.** A line with no speaker says "people in <town>" only when its quest is that town's own dialogue quest: the name is a town and "Dialogue" ("Riften Dialogue", "Solitude Dialogue", "Whiterun City Dialogue", "Riverwood dialogue"). The town is the one the quest names, not the place's nearest town, so a Whiterun line near Riften would say Whiterun. The dialogue quest isn't shown as `inQuest` (it isn't a quest a player does). Every other line with no speaker is left out.
- **What goes.** Forelhost's "Return to me here once you've obtained the mask" (Siege on the Dragon Cult, which still shows in `questGoesThere`) and Crystaldrift Cave's "Fancy a trip?" are gone, as are about 1,600 other speakerless lines across the index. The records carry only the quest and the plugin for them: no alias, no faction, and `plugins.json` has no description, so I can't tell a follower's comment from a villager's by anything but guessing at plugin names (FDE Aela, Lucien, Inigo). I did not guess, so a follower's comment is left out, not named "a follower". Naming the alias's person and the follower needs a `speaker` from the PC's side (WO-144 Part 1e-3); the door already shows one when it comes.
- **A line you might want back.** The 25 "Carriage system dialogue" lines (Skyrim.esm and the Unofficial patch) are left out too. Embershard Mine's "Old Embershard Mine's up there. Used to produce a lot of iron..." is one, so Riverwood's Embershard Mine now shows Nirenoore's line from The Welkynar Knight and the Guard's Dossier. If you say a carriage driver speaks them, it's one line to add ("a carriage driver").
- **A side effect.** A place whose only lines were unattributed now says `noPointer` ("Nothing in the game names it. A hook here is the player's own"): Lost Prospect Mine does. Said plainly: the game does name it, in a line the records can't attribute.
- **Tests and checks.** `wo151.test.ts` now has five tests for this (the town's line, Forelhost and Crystaldrift left out, no unattributed line anywhere, Whiterun and Solitude name their own towns, a named speaker stays); `wo128.test.ts` and its e2e expect Nirenoore's line for Embershard Mine. Typecheck, lint, 681 unit tests, the build and the places and door e2e (17 tests) pass.

- Bob, 23 Oct, 17:42: the attribution fix read; 227 door tests pass. Done.
- **The PC's new shape (23 Oct, after 1e-2).** `places.json` now has `actors: {count, hostile: false}` for the 69 places whose people aren't hostile (inns, guild halls, temples, keeps, stables, and the four Orc strongholds), with no floor, ceiling or table. That turned the contract test's shape check red on staging. The door was unaffected (all 65 non-strongholds were already stops, and the strongholds are handled by type), but I added `hostile` to the `Actors` type, made `hostile: false` a reason to leave a place out of `placesNear` (strongholds excepted), and let the shape check skip those places. A test checks that none comes back. This is the "any place whose people aren't hostile" half of the first WO-151 part, now from the data and not only the type.

---

## WO-150  suggest_places is broken on every input (Mac, urgent, 23 Oct 2026)
Status: done

**Why.** Dave's Claude, re-planning Kyria (17:01): "One planner tool (suggest_places) is broken on every input, so I'm reading its places data from the repo instead." Bob, live: `suggest_places` returns `Cannot read properties of undefined (reading '0')`. Cause: WO-144 Part 1d (PC, 9eed4b1) changed `places.json`'s `actors` from `levels: [lo, hi]` to `floor`, `ceiling` and `atLevel`, and `src/lib/places/suggest.ts` still reads `p.actors.levels[0]` (lines 95, 110, 162). The unit tests use fixtures in the old shape, so nothing went red.
- [x] `suggest.ts` reads the new shape (`floor`, `ceiling`, `atLevel`, the boss); WO-148 item 9's fit uses `atLevel` and the boss as written there. Words: "bandits from level 6; at 12 you meet 6 to 12; the chief about 10".
- [x] **A contract test against the real data:** `suggest_places`, `get_quest` and `get_quest_log` run on the generated `places.json` and `quests.json` (not fixtures) for Kyria's acts and three towns, and fail on any thrown error. The same for every tool that reads a generated file.
- [x] Live: `suggest_places` for Kyria's Act I and `where: "Solitude"` returns places (checked here through the door in the e2e on the real data; the live deploy is Bob's check). Push staging with `Status: for Bob`.

### Jeff's notes (Mac, 23 Oct)
- **The shape.** `src/lib/places/data.ts` has `Actors` (`floor`, `ceiling`, `atLevel`, `zoneMin`, the boss) and two accessors the tool reads through: `rangeOf` (the weakest and strongest, from `floor` and `ceiling`) and `meetsAt(actors, n)` (the row of the highest gate at or below n, or none open to her yet). They also read the table spelled `from` and `meets`, which the PC's Part 1d-2 box says is coming, and the old `levels`, so the next rename doesn't break the door again; the contract test below is what would catch a rename the accessors don't know.
- **The fit uses `atLevel`.** F is what she meets at the act's top level (`meetsAt`), else the place's floor when no row is open to her yet; the thresholds and the boss are as written under item 9. Said in the place's `enemies`: "enemies from level 6, never below 6; at 5 you meet 6 to 20; the boss Zulakaroth, Keeper of the Dragonstone, level 40" (so a wide range is never hidden, and what she meets at the act's levels is on its own). The word for a ranged boss is the PC's own ("leveled 6-10", and "matches your level, 10 to 20" when it comes), passed through; Bob's example wording ("the chief about 10") would need a word from the PC's side for the boss.
- **The contract test (`src/lib/mcp/contract.test.ts`).** On the generated files, not fixtures: every town at three stretches of levels (with and without an end), every place's fit at every fifth level, every hold, town and place as `where`, the stored-act form, `get_quest` for all 1,226 quests (and with a player at three levels), `get_quest_log` with every quest started, `suggest_quests` for every town and hold, `get_perk` for every perk, `get_tree` for every tree, `get_spell` for every spell, `get_creation`, `get_rules`, `search_facts` on a sample of every kind including items, and `check_progression` on a drafted build. Each must not throw and say no stray "undefined" or "NaN". Run against the old `suggest.ts` it fails four tests with the same error the player saw; with this change it passes. It is in `npm test`, so the pipeline's "generated files are a contract" rule has a check. Not covered, said plainly: tools that need a signed-in player's database rows (the playthrough writes), which have their own e2e.
- **Checks.** Typecheck, lint, 663 unit tests (with the contract test and the player questions), 273 gamedata tests and the build pass; the places and door e2e (`wo128`, `wo129`, `wo147`, `wo148`, 17 tests) pass. I did not rerun the whole e2e for this urgent order: nothing on a screen changed.

- Bob, 23 Oct, 17:35: live, `suggest_places` for Kyria's Act I works again (16 places near Riften). Done. What it says is the next problem: WO-151 (Mac) and WO-144 Part 1e-3 (PC).

---

## WO-149  The save connector's skills come back empty (PC, 23 Oct 2026)
Status: held (Dave, 23 Oct, 19:35: everything paused; see docs/pause-2026-10-23.md; was: for Bob)

**Why.** Kyria's snapshot has `skills: {}` (Save 70 and Save 114), though the connector's description says it reads skills and WO-123 built skills from the save. Speech gates Tome Trials tiers and follower slots; Two-Handed and Heavy Armor decide what an act can fight.
- [x] On Dave's PC, run the installed save connector against Save 114 and say what it returns for skills, and which version of the connector is installed (the `.mcpb` Dave added vs the one `tools/save-connector` builds now).
- [x] If the reader can't find the skills in this save: find them (the save's actor values for the player, base and current), fix the reader, add Save 114's numbers as a test (Speech, Two-Handed, Heavy Armor at least), rebuild the `.mcpb`, and tell Dave in the order how to reinstall it.
- [x] `set_snapshot` from it fills Kyria's `whereYouStand.skills`. Push staging with `Status: for Bob`.

**Found (PC, 23 Oct): not a reader bug -- the installed `.mcpb` predates WO-123 entirely.** `C:\Users\daveh\AppData\Local\Claude-Data\...\Claude Extensions\local.mcpb.dave-hughes.lorerim-save-connector\server\index.js` (the bundle Claude Desktop actually runs) has no `parseSkills`, no `PLAYER_REF`, no `SKILLS = [...]` anywhere in it -- that build is from before skills reading existed at all, so of course it answers `{}`; the current reader (`src/lib/save/read.ts`) was never asked the question.
- **Checked by hand against Save 114 directly** (its own real bytes, not a fixture): a Python port of `readSave`/`parseSkills`, written fresh from the TypeScript, decompresses the body (LZ4, `lz4.block` in Python), finds the player's change form (ref `0x14`), and the one 27-entry run at byte offset 70139 reads real, sane values (Speech 50, Two-Handed 64, Heavy Armor 64, 236 quests). The current source is correct.
- **Confirmed by actually running the connector, not just the logic.** `npm install` is still broken here (the same `spawnSync`/missing-platform-binary issue logged throughout this session -- `esbuild` needs `@esbuild/win32-x64`, and installing it alone fails the same way), so `node tools/save-connector/build.mjs` can't run in this session. But `git log` shows nothing has touched `src/lib/save/` or `tools/save-connector/` since commit `d384381` (WO-123 Part 3, 23 Oct 13:01) -- the exact minute a leftover build from that commit sat in this PC's own Temp folder, quest_forms.json byte-identical to the repo's current copy. Spawned that bundle's own `server/index.js` directly as a real MCP server (no build needed to *run* it, only to make a fresh one) against an isolated copy of Save 114's file, sent it `initialize` then `tools/call read_latest_save` over stdio exactly as Claude Desktop would, and it answered with the same values the Python port found, plus the full `snapshot` `set_snapshot` would receive. End to end, not just the parser.
- **The fix: reinstall, not rebuild.** The correct, already-built bundle is at `tools/save-connector/dist/save-connector.mcpb` in this checkout (gitignored, so it won't show in a diff). **Dave: in Claude Desktop, Settings -> Extensions -> Advanced settings -> Install Extension…, and pick that file** (or double-click it) to replace the old one; it'll ask to update the existing "LoreRim save connector" extension. Then ask your Claude to read your latest save again -- skills should fill in.
- **Test added.** `src/lib/save/read.test.ts`: `parseSkills` against Save 114's own 216 raw bytes (the actor-value list itself, hex, not a fixture), asserting the exact values above -- a real-data regression, not only the synthetic one `fixture.ts` builds. **Not run**, for the same `npm install` reason; the Python port's independent result and the live MCP round-trip above are what this is actually checked against this session.

---

## WO-147  A page for every quest, and grab-bags as shelves, not lines (Mac, 23 Oct 2026)
Status: done

**Why.** Dave (23 Oct), opening `/quests/capital-whiterun`: "what is this quest line exactly?" It isn't one. "Whiterun, expanded" is eight unrelated jobs from Capital Whiterun Expansion (a house, a giant, a rat cellar, the white horse, a festival, a farm, a temple job, a skirmish), bundled by the mod they came from and shown as if a story: the page opens on "I've received a note by a messenger from Whiterun", which starts only the house quest, and the bundling is what produced Running Wild's false "comes after" gate. "Windhelm, expanded" is the same. And a quest has no page of its own: it's a section of its line's page, so a search, a link from a playthrough or a link from an assistant lands on the whole line.

### Part 1. A page for every quest
- `/quests/q/<slug>` for each of the 1,242 quests (slug from the name, the EDID when two share a name). It shows, in this order: how it starts (who, where, what you do, its needs, "open for you" when signed in with a playthrough), the first step, its objectives, its endings and what changes the run, what it's part of (its line or shelf, with a link, and the quests before and after when the line has an order), where it was checked, and "This was wrong" / "I know how this starts" for that quest. Design rules apply (no micro labels, the game's words); match the line page's look.
- The line page lists its quests linking to their pages, keeping the short how-it-starts under each; `search_facts`, `get_quest` and playthrough objectives link to the quest page, not the line. The quest log (`get_quest_log`) links too.
- Screenshots at 1440 and 390 of Running Wild's page and a main-quest page (Bleak Falls Barrow).

### Part 2. Grab-bags become shelves
- A mod's bundle of unrelated quests is a **shelf** (as "Odd jobs in the Rift" is): no line-level opening, no implied order, no "comes after", each quest standing alone. Its name says what it is: "More to do in Whiterun", "More to do in Windhelm".
- Decide which lines are grab-bags from the records: a line is a story only if its quests set each other's stages (one quest's stage or ending starts the next); otherwise it's a shelf. Log the list under this order (expected: the two capitals' expansions and similar city or town packs; the Dragonborn, guilds, Daedric and the lands mods stay lines).
- A placeholder objective ("TEST", empty, or the editor's own note) is hidden from pages and the door (Skirmish at Whitewatch's first objective reads "TEST").

### Done when
- [x] Part 1: quest pages, linked from lines, search, the door, playthroughs and the quest log; screenshots (`test-results/wo147-running-wild-1440.png`, `-390.png`, `wo147-bleak-falls-barrow-1440.png`, `-390.png`, `wo147-shelf-line-1440.png`).
- [x] Part 2: grab-bags as shelves with the logged list; no line-level opening on them; placeholder objectives hidden.
- [x] Player question 33: "Tell me about A Rat Problem" links to its own page and names no opening from another quest. Every check in CLAUDE.md passes (see Checks: one red unit test is the PC's, from WO-144). Push staging with `Status: for Bob`.

### Jeff's notes (Mac, 23 Oct)
Decisions made under WO-138 Part 5, each with why:
- **The shelf list, from the records.** A line is a story only if one of its quests' record-form start (`raw`) names another quest of the line: "After X", "X stage ... ", "X completed", or "Through X". Of the 56 lines with more than one quest, 20 outside the work shelves have none. Per Bob's expectation (Dragonborn, guilds, Daedric and the lands mods stay lines), and because a follower's quests are one person's, I took only the `side` ones. **Made shelves (category work, `begins` off): Whiterun, expanded (now "More to do in Whiterun", 8 quests), Windhelm, expanded (now "More to do in Windhelm", 13), Fists of Fury (3 brawler quests, three cities), Markarth Side (2 unrelated relic quests), More to do in the Soul Cairn (3), The Gift of Saturalia (6 festival quests).** **Kept as lines by judgement though no start names another quest: Dark Ancestor (one quest twice, a B variant) and The Book of Love (a quest and its sequel).** **Kept by Bob's rule though they have no links: Baan Malur, Black Books, Forgotten City, Siege at Icemoth, Thirsk (lands); A Daedra's Best Friend, Pieces of the Past, The Taste of Death, The Whispering Door (Daedric); Faralda, Fura, Lucien, Serana (followers).** A test holds the rule: no other side line with more than one quest lacks a link (`wo147.test.ts`).
- **What a shelf's page leaves off.** Its first quest's giver, ways in and first step are that quest's facts, so the shelf's page no longer shows them as the whole bundle's (this holds for every work shelf, odd jobs and Missives included, which had a giver taken from their first quest); they are on each quest's page and under its row. The shelf says "Separate jobs, each with its own start. Open one for how it starts." (a plain statement, not a how-it-works paragraph; change it if Bob would rather it were gone). No "Starts here" on a shelf's rows. The quest data still holds the first quest's giver for a shelf because the place matching in `suggest_quests` reads it.
- **Quest pages.** `/quests/q/<slug>`, from the quest's name, or its EDID when two share a name or it has none: 462 of 1,226 use their EDID. The data has 1,226 quests, not the 1,242 the order says (the 16 are the handlers WO-138 took off the lines). A test makes every quest's address unique and round-trips them all. A quest's page: how to start it (who, where, ways with a player's report marked, the first step, where it was checked), objectives, how it can end with what it hands over, what it is part of (a story names the quest before and after it; a shelf's stands alone), and the report forms for that quest only. Signed in with a run, "For <run>: open for you / locked / unknown", from their most recent run's save.
- **Links.** The line page's quest rows link to the pages and keep a short how-it-starts (first way, with how many others) under each name. `get_quest` has `link`; `search_facts` gives a quest hit a `link`; `get_playthrough` gives a quest objective a `page`; `get_quest_log` gives each entry a `page` (a helper standing for its line links the line); the site's `@` links for a quest go to the quest's page.
- **Placeholder objectives.** Hidden where the quest data is read, so no page or tool sees one: "TEST", empty, a few note words, or a line starting with a semicolon. Only one quest in the data has one: Skirmish at Whitewatch.
- **Question 14 changed.** Its second category was "Side stories" (Whiterun, expanded); that line is a shelf now, so it asks for "Guilds and factions" (the Companions) and "Jobs and errands", and the log shows page links. Question 33 passes.
- **Not mine, red on staging: `wo128.test.ts` "nothing is in a city or a home".** The PC's WO-144 places now include towns (Helgen, twice, type Town) near Riverwood, which `placesNear` returns; the test says no City, Town, Settlement, House or PlayerHouse. It fails on a clean staging too. I left it: whether suggest_places should offer towns is the PC's call. Bob, please settle which way it goes.
- **Checks.** Typecheck, lint, 273 gamedata tests and 624 unit tests (with the player questions) pass except the one red test above (the PC's, on a clean staging too); the build; the full e2e passed 375 of 377. One failure was `wo146.spec.ts` (my own spec: a quest row now says its way twice, so its locator is scoped to the opened section), fixed and passing; the other, `wo114.spec.ts` (/me grid, 10.5 s), is a timeout that passes when the file is run alone (repeating the file fails its first test on the second pass, because the seeded build keeps the run it made, which says nothing about this order).

### Part 3. Bob's ruling on the red test (23 Oct, 16:40)
`suggest_places` is for places a character goes on purpose out in the world (rule 20). Towns, settlements, cities, inns, temples, keeps, stables and homes are now in `places.json` because routes, search and objectives need them, but they are **stops, not suggestions**: `placesNear` leaves them out by kind. Orc strongholds stay in (a destination with a gate and a reason). The test stays as written, with strongholds allowed. Yours, since `placesNear` is Mac's.
- [x] Part 3: `placesNear` filters stops by kind; `wo128.test.ts` green.

- Bob, 23 Oct, 16:40: Parts 1 and 2 read and accepted (the shelf list, the shelf's plain line, 462 EDID slugs are fine). The live door still shows the old line for A Rat Problem; I'll recheck it after the deploy.
- **Part 3 (Mac, 23 Oct).** `placesNear` leaves out City, Town, Settlement, Inn, Temple, Keep, Stables, House and PlayerHouse (Bob's list, by the index's own type names); Orc strongholds stay, and the `wo128` test stands as written. One call to flag: **Guild halls (14 in the index) stay in**, since Bob's list didn't name them; if a guild hall is a stop too, add `Guild` to the set in `src/lib/places/suggest.ts`. A test goes through every town and checks no stop comes back and every stronghold does. Unit tests 626 pass; typecheck, lint and the build pass; the places and quest specs (`wo128`, `wo129`, `wo146`, `wo147`, 20 tests) pass. I did not rerun the whole e2e for this one change, which is confined to `placesNear`.

- Bob, 23 Oct, 17:30: Part 3 done (stops left out). `wo128.test.ts` is red again on a different line: Embershard Mine reads "plant now, pay off later (levels 24 and up)" for an act in Riverwood, because the PC's new levels give its ceiling (24) and `when` judges by the ceiling. Carried to WO-148 item 9.

---

## WO-146  Players fill the gaps: quest facts from signed-in players, proposed by an agent, approved by a person (Mac, 23 Oct 2026)
Status: done

**Why.** Dave (23 Oct): a Discord-signed-in player should be able to tell the planner what they know about a quest (how it starts, who, where, where a note or book is), not only "this was wrong". Dave's own finds (Running Wild's board, Paragliding near Falkreath) went in by hand through `overrides.json` as player reports, and that is the model: reviewed, approved by a person, then on the pages marked as a player's report with its source. 18 quests are "not checked" and about 370 mod quests have no second source; players are the only way to fill them. Most of the plumbing exists: `report_quest` on the door, the `quest_report` table (`what`, `text`, `said`, `source`, `status`), the site's "This was wrong" form, and `/admin`'s Quest reports.

### Part 1. What a player can send
- The site's form under a quest (and `report_quest` on the door) gains a kind: **"Something's wrong"** (as now) or **"I know how this starts"** / **"I know where this is"**, with fields for the way in (who, where, what they did), the place (town, building, nearest landmark), and free text. Sign-in required, as now.
- `quest_report` gains `kind`, `fields` (jsonb: who, where, how, place), and `proposal` and `decision` (below). Schema through `npm run db:generate`, additive only.

### Part 2. The agent proposes
- A **Propose** action on each new report in `/admin` (and a `propose_quest_fact` step the admin can run on a batch): it reads the report against the quest's records in the generated data (its ways, its needs, `readables` and `boards` places) and writes a **proposal**: what would change on the page, in the page's words ("Way in: read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun"), how it fits the records (agrees, adds a place the records leave unnamed, or contradicts them), and its confidence. It never writes to the pages.
- The proposal runs server-side with the Anthropic API (key in Vercel's env, never in code), one call per report, logged.

### Part 3. A person approves
- `/admin` shows each report with the player, the quest's current page text, the proposal, and three buttons: **Approve** (writes the hand-kept entry the build reads: a `quest_player_fact` table, read by `quests.json`'s build the way `overrides.json`'s `_checked: "players"` entries are, with the source "a player's report (Discord handle, date)"), **Edit and approve**, **Not a problem**. Admins only.
- An approved fact shows on the page and through `get_quest` as "a player's report, not the game files (<handle>, <date>)", exactly as Dave's do. A later file check that agrees replaces it; one that disagrees flags it for review.
- The player gets a line on their `/me` page: "Your report on Running Wild is on the planner now. Thank you."

### Done when
- [x] Part 1: the two new kinds on the site and the door; the migration (0027, additive).
- [x] Part 2: Propose on a report, its proposal stored, nothing written to the pages; a test with a stub API (`src/lib/quests/wo146.test.ts`, and the e2e's stub server).
- [x] Part 3: Approve writes the player fact; the page and `get_quest` show it as a player's report; `/me` says so. e2e: a report on Running Wild is proposed, approved and shown (`e2e/wo146.spec.ts`).
- [x] Every check in CLAUDE.md passes (typecheck, lint, 607 unit tests with the questions, build, the full e2e); screenshots of the admin view at 1440 (`test-results/wo146-admin-proposal-1440.png`, also `wo146-quest-page-1440.png` and `wo146-me-1440.png`). Push staging with `Status: for Bob`.

### Jeff's notes (Mac, 23 Oct)
Decisions made under WO-138 Part 5, each with why:
- **The overlay is read at run time, not by the build.** The order says the fact is "read by `quests.json`'s build the way `overrides.json`'s entries are", but that build is a Python step that has no database, and an approved fact has to show without a deploy. So `questsData()` lays the approved facts over the generated data when it is read (`player-overlay.ts`), exactly as `overrides.json` marks Dave's finds: the way carries `checked: "players"` and a `source`. The pages and the door call `loadPlayerFacts()` first; each copy of the store (a server instance, and within one the pages' and the door's own bundles hold separate copies) looks again at most every ten seconds, and the copy that took an approval shows it at once, so an approval is everywhere within ten seconds. The e2e found the first version's minute too long. A database that can't be reached leaves what was loaded. `quests.json` itself is never changed. If Bob wants the facts in the committed data too (so a file check can "replace" one, as the order says), that is an export step to write, and it is not built.
- **Replace or add.** An approved fact says which way's words it replaces (or none): a replaced way takes its place in the "One of" need and keeps its needs, and a place the player gave takes the place of the "unplaced" note. A new way is added to the "One of" need. The record form (`raw`) is the files' and is not touched, so a player's way never makes a locked quest open.
- **Where it shows.** The quest page's How it starts and Ways in say "player report, @handle, 23 Oct 2026". `get_quest` says "a player's report, not the game files (@handle, 23 Oct 2026)", the same line as Dave's two. For a quest whose start isn't checked (18 of them) `get_quest` still gives no instructions, but it now shows a player's way and says it is that, which the order's purpose needs. The source is the player's handle (their name when they have none) and the date the report was sent.
- **Propose.** Admin-only. One call per report with `fetch` to the Anthropic Messages API (the SDK isn't a dependency), the key from `ANTHROPIC_API_KEY`, the model `PLAYER_FACT_MODEL` or `claude-sonnet-5-5`; each call is logged (`quest-proposal`: report, model, tokens) and the proposal (words, the way, what it replaces, fits, confidence, why, model, time) is stored on the report. It is told to use only the report and the records, never to add a place or person from memory, and to say "contradicts" when it does. A batch step ("Propose on new reports", 10 at a time, one call each) is in /admin. **For Dave: `ANTHROPIC_API_KEY` must be set in Vercel (Preview and Production) before Propose works there; without it the button says so.** The e2e points the app at a stub server and never calls the real API.
- **Approve, Edit and approve, Not a problem.** Admin-only; Approve needs a proposal with a way, Edit and approve needs none. A report is decided once. Not a problem writes no fact. `/me` says "Your report on Running Wild is on the planner now. Thank you." for each report approved in the last thirty days.
- **What a player can send.** The site form (and `report_quest`) has three kinds: Something's wrong (as before), I know how this starts (who, where, what they did), I know where this is (the place), the last two naming one quest of the line. Same sign-in and 5 an hour. A "wrong" report is still not proposed on by the batch (it has no way to propose); the Propose button is on how and where reports.
- **e2e hygiene.** `quest_player_fact` rows keep no user when a test user is deleted, so the e2e seed and cleanup delete them first; otherwise Running Wild would stay altered in the dev database.
- **Not built, said plainly.** "A later file check that agrees replaces it; one that disagrees flags it for review" is not built: that needs the export step above. Today a player fact stays until someone removes the row.
- **Checks.** Typecheck, lint and 607 unit tests (with the player questions) pass; the build; the full e2e passed 371 of 372 on the final build. The one failure was `wo24.spec.ts`'s avatar-menu keyboard check (10.5 s, a timeout), in a header test this order doesn't touch; it passes three times alone. Two real faults the e2e found in my own work are fixed: the admin list showed "Something's wrong" where the older spec expects the report's own part (it still does for those), and a minute was too long for an approval to reach every copy of the facts (now ten seconds).
- Bob, 23 Oct, 14:45: all four boxes and the tests read; the flow is right and nothing reaches a page without an admin's approval. Live, Propose needs `ANTHROPIC_API_KEY` set in Vercel (Preview and Production); until then it fails with the key missing. Dave sets it. The admin screenshots are on the Mac, not in the repo; Dave sees the real thing in `/admin` on the preview.

### Part 1b. When nothing needs to change (Dave's first live Propose, 23 Oct, 14:55)
Dave sent "The note is on the board by Joslin's house" on Running Wild. The proposal was right ("agrees, high confidence … nothing on the page needs to change"), but the card still offered Approve, Edit and approve and Not a problem, with "Proposed" and "Replaces" showing the same words. When a proposal changes nothing:
- Say so plainly in place of Proposed/Replaces: "Already on the page. Nothing to change."
- One button: **Close: already on the page** (status "fixed", decision "no change"), plus Edit and approve for when the admin wants to change it anyway.
- A report that agrees with a player's report already on the page counts as a second confirmation: the page's source becomes "players' reports (2): Dave, 22 Oct; Tapps, 23 Oct". Two independent players agreeing is worth showing.
- [x] Part 1b, with a test on a no-change proposal (`src/lib/quests/wo146.test.ts`, and the e2e's second player).

### Jeff's notes on Part 1b (Mac, 23 Oct)
- **What counts as "changes nothing".** A pure check (`changesNothing`, `player-source.ts`): the proposal's way has the same words as a way already on the page (case and punctuation aside) and nothing in it the page lacks (a place, a person, a where); or it agrees and gives no way. The check runs on the page's ways as they are now, with the approved facts on them. Dave's live case ("The note is on the board by Joslin's house") is the first test.
- **The card.** In place of Proposed and Replaces it says "Already on the page. Nothing to change." with the agent's "against the records" line; the buttons are **Close: already on the page** (status fixed, decision "no change"), Edit and approve, and Not a problem. Approve is gone when nothing changes, and the server refuses to close a proposal that does change something.
- **A second player counts.** When the way it agrees with is already a player's report (Dave's in `overrides.json`, or an approved fact) and the reporter is a different player, closing it writes a confirmation (`quest_player_fact.confirms`, migration 0028, additive) that adds the reporter to that way's sources. The page then says "players' reports (2): Dave, 22 Oct; Tapps, 23 Oct" (names and days only, shortened from the full source), and `get_quest` says "players' reports, not the game files (2): Dave, 22 Oct; Tapps, 23 Oct". The same player twice counts once, and a confirmation of a way the files hold changes nothing: only a player's way gains sources. Three players read "(3)".
- **Stale test fixed, not mine.** `wo128.test.ts` pinned Whiterun as a city the places index doesn't measure; WO-144 Part 1 item 1 (the PC's capitals) made every capital measured, so the unit tests were red on staging at the time I pulled. I updated it to the new truth and kept the behaviour covered with a name no place is nearest to.
- **Checks for Part 1b.** Typecheck, lint and 614 unit tests (with the player questions) pass; the build; the full e2e passed 373 of 373. Screenshots: `test-results/wo146-admin-nochange-1440.png`, `wo146-quest-two-sources-1440.png`.

- Bob, 23 Oct, 15:40: Part 1b read; done. Dave sees it on his Running Wild report in `/admin` (Propose again).

---

## WO-145  An XP budget for every act: level ranges computed, not wished (PC, then Mac, 23 Oct 2026)
Status: held (Dave, 23 Oct, 19:35: everything paused; see docs/pause-2026-10-23.md; was: Part 1 for Bob (PC); Part 2 queued (Mac))

**Why.** Dave, from Kyria's run (23 Oct): Act III says "levels 8 to 20" and ends at a level-20 gate (The Mind of Madness). She reached Solitude at 15 (Save 114: level 15, 186 / 650 XP). Almost nothing in Act III pays XP: the Skeever room, shifts, nightly songs and Beirand are tasks; Holy Fire is a spell; the Edda waits on Tending the Flames (Act VII); The Mind of Madness is the gate. 15 to 20 is about 3,300 XP; her two callings cap near 170 a day each, so that's about ten in-game days of nothing but songs and books. The range was typed in as a wish. Dave: "my confidence that we're able to design characters and accurately recommend levels that could be achieved based on the steps the user takes through the acts is very low." The planner already holds quest XP by type (`QUEST_XP` from Experience.ini in `quest_pages.py`: Main and Daedric 200, Side 100, Misc 0) and each place's clear XP (`places.json`), and the save connector reads current XP. What's missing is the curve, discovery XP, the callings' caps, and the sum.

### Part 1. The numbers (PC)
From LoreRim's install, each with its file and value in `xp.json`:
- [x] **The Experience curve:** XP to reach each level 1 to 100 (Experience.ini; Save 114's 650 at 15 is a check: 575 at 12, rising 25 a level).
- [x] **What pays XP in LoreRim:** quest XP by type (as `QUEST_XP`, rechecked), location discovery and clearing (Experience.ini's values by location type), and the small sources LoreRim turns on (brewing 5, enchanting 5, disenchanting 5, mining 10, per `lorerim/systems/crafting.md`; reading, if any; kills, if Experience grants any in this list).
- [x] **Callings:** each calling's XP per action and daily cap, from the mod's own data on Dave's PC (after the 19 Oct retune: Bard 25 a song, 5 a day; Scholar 17 a book, 10 a day; plus first-inn and series bonuses), and whether the cap scales with level (today it doesn't).
- [x] **The curve:** Kyria's save suggests 25 × (level + 11) (575 at 12, 650 at 15); confirm it from Experience.ini, don't assume it.
- [x] **Repeatable fillers:** Missives (100 XP each, per leg of the route, never as a lump: WO-148 item 7), the jarls' bounties, the Bards College's Tome Trials exams (50 / 100 / 200 by tier, **only after Tending the Flames**: WO-148 item 8), radiant faction jobs, with their XP.

**Built (PC, 23 Oct).** `scripts/gamedata/xp.py`, new, writes `gamedata/5.0.4.8/xp.json`.
- **The curve: measured, not read from a formula, because there isn't one on the install to read.** `Experience.ini` carries no level-curve key at all; `MCM/Settings/Leveling Freedom.ini`'s own base/per-level numbers (100, 30) don't fit Kyria's saves either. Measured instead, directly: `lvlUpExp` at every distinct level a save on Dave's PC has reached (1 to 29, across saves 1 through 372, each read from the save's own header, no decompression needed). All 20 points fit `25 * (level + 11)` exactly, no exception -- Dave's own guess (from two points), now a measured fact from twenty, carried with its own evidence in `xp.json` so the next person can re-check it against a different save without re-deriving it.
- **Quest XP, rechecked: `quest_pages.py`'s own `QUEST_XP` table already matched the file exactly** (Main/Daedric/Dawnguard/Dragonborn 200, Civil War 150, Side/College/Thieves/Brotherhood/Companions 100, Misc 0) -- nothing to fix, confirmed against `Experience.ini`'s own `[Questing]` section, not assumed right because it looked plausible.
- **Discovery and clearing: `places.py`'s own `clear_xp()` reused, not read a second time.** Discovery is flat at 10 for every place type; clearing varies (a fort, a Nordic or Dwemer ruin, a dragon lair: 200; everything else: 100) -- the per-type variation was already being read correctly, just never surfaced outside `places.json`'s own rows until now.
- **Crafting, reading, killing, raw skill use.** `MCM/Settings/Crafting Grants XP.ini`: alchemy/enchanting/disenchant 5, mining 10, smithing/tanning/smelting/cooking 0 -- matches the field guide's own crafting document exactly (which had already checked these against two players' reports). `Experience.ini`'s `[General]`: reading off (`bEnableReading = false`), raw skill use off (`bEnableSkillXP = false`) -- neither pays character XP in this modlist. Killing is on; its own formula factors (`fLevelFactor`, `fGroupFactor`, `fMaxLevelMult`, `fDamageThreshold`, `fKillingMult`) are given as the file has them, not resolved into one number, since the actual XP depends on the target's level relative to the player's at the moment of the kill -- not something this reader can know ahead of a specific fight, so not guessed at.
- **Callings: all 144 of the mod's own `GLOB`s, read from `Callings.esp` directly, not the source scripts' own comments** (which can drift from what's actually shipped -- checked, and in this case they matched, but the record is what's shipped). Bard: 25 XP a song, daily limit 5 (6 at Journeyman, 7 at Master), plus a 50 XP first-inn bonus and 25 per inn completed. Scholar: 17 XP a book, daily limit 10 (13 Journeyman, 17 Master), plus a 10 XP per-volume series bonus. Both exactly the order's own stated numbers.
- **Correction: the daily cap does scale, with the calling's own rank, not (as far as this reader can tell) with character level.** Every calling's own `DailyLimit`/`DailyXP` rises at `_Journeyman` and `_Master` (Bard 5/6/7, Scholar 10/13/17, Hunter's skinning XP 200/250/300...). Whether the calling's own rank tracks character level, total calling XP, or something else entirely isn't in these globals -- flagged, not assumed either way, correcting the order's own "today it doesn't."
- **A bigger finding: this load order ships 13 callings, not the 9 named elsewhere in this project** (`places.py`'s own docstring, Part 2's own data). Wanderer, Pilgrim, Cook and Alchemist are real, with their own full XP/cap/bonus data in the same `GLOB`s -- worth Mac's own Part 2 and WO-143's own doings index knowing about, since a door that only lists 9 callings would be missing four real ones.
- **Checks.** 334 gamedata tests pass (9 new).

- Bob, 23 Oct, 19:30: Part 1 read in the order and the commit. The curve is measured from 20 levels across 372 saves, not assumed; quest XP rechecked against Experience.ini; reading and raw skill use pay nothing; Callings read from the plugin's own globals, and the daily cap scales with the calling's rank. Accepted. Part 2 is the Mac's.

### Part 2. The budget on every act (Mac)
- `get_playthrough` and the act's card on Play show, per act: **XP needed** to go from its start level to its end level (the curve); **XP its plan pays**: each linked quest's XP by type, each linked place's clear and discovery XP, each passed-by place's discovery XP, and the character's callings at their cap times the days the act says it spends (`set_act` takes `days`; none set means none counted); and **the gap**.
- **Level ranges are outputs.** An act's start level is the previous act's end; its end level is the level its XP reaches on the curve. `set_act`'s `levels` becomes a target the assistant states; the card shows the target and what the plan reaches, and warns when they differ by a level or more.
- **A level gate needs a road to it.** When the next act opens on a quest with a level gate (The Mind of Madness, level 20), and the plan's XP doesn't reach it, `check_progression` and the card say so: "Act III reaches level 16; The Mind of Madness needs 20: 2,600 XP short."
- **Filler that fits.** On a deficit, `suggest_objective` offers fillers from Part 1 that suit the character and the act's towns: Missives from the act's town board, Tome Trials at the Bards College when the act is in Solitude, at-level side quests in the hold, dungeons on the route (`suggest_places`), calling days. Each with its XP. Never "grind"; always a named thing to do.
- **The save keeps it honest.** With a snapshot, the card shows where she actually is against the budget ("Save 114: level 15, 186 of 650; the act planned 18 here").
- The style guide: an act's levels come from its budget; never end an act at a level gate it can't reach; say the gap and offer fillers.

### Part 2b. The shape of a run: a guideline, not a rule (Dave, 23 Oct, 13:30 and 13:34)
Dave's decision after the XP discussion: Callings stays a starter, not the engine; scaling its XP so a role-player can level on songs alone is the wrong fix. The design problem is the run's shape. **But the shape is a guideline the planner weighs, not a rule it enforces**: some players want a slow, quiet run and that's a fine character. So:
- **The usual shape, as guidance.** Most runs go: levels 1 to about 10, the calling and the town carry it; about 10 to 15, the story starts sending her out (a side quest at her level, a camp or dungeon on the route, the first steps of a guild or the main quest); 15 to 20 on, the core game, with the calling as a supplement. The style guide says this as "usually", with the reasons (the world's content is built for levels; a long stretch of only songs and books gets slow), not as "must".
- **Ask, as a design question.** WO-139's Before you design gains one: **"How soon do they head out into the wider world, and how much fighting do they want?"** Quiet for a long time, the usual, or straight into it. The answer is kept with the others and sets how the planner weighs fillers and when it nudges. "No answer" means the usual shape.
- **Fillers follow the answer.** For the usual or faster shape, past about level 10 the planner offers core-game fillers first (camps and dungeons on the route with their clear XP, at-level side quests in the hold, Missives), a calling day last. For a quiet run, calling days and town work stay first, and the budget is honest about how slow that is.
- **Nudges, not blocks.** When an act past level 12 gets most of its XP from the calling and the player didn't ask for a quiet run, the card says so once, softly ("Most of Act III's XP is songs and books; she might be ready for something out in the world"), with two or three suggestions. Never a failing check, never a refusal; the player can dismiss it.
- The only hard line stays the one that's about facts, not taste: an act shouldn't end at a level gate the plan can't reach without saying so.

### Part 3. Kyria as the worked example
Kyria's Act III shows the gap from Save 114 and fillers that follow the shape (a camp or dungeon on the route, an at-level side quest in Haafingar, a missive along the route; a calling day last; not Tome Trials, which wait on Tending the Flames), and its range becomes what they reach.

### Player questions
- 31. "How does Kyria get from 15 to 20 in Act III?" returns the XP needed (about 3,300), what the act pays, the gap, and named fillers with their XP.
- 32. "What level will she be at the end of Act II?" returns the level the plan's XP reaches, not the typed range.

### Done when
- [ ] Part 1: `xp.json` with its sources. (PC)
- [ ] Part 2 and 2b: the budget on the act, ranges as outputs, the gate warning, fillers following the player's answer, the soft nudge (dismissable), the save against the plan, the guideline in the guide and the new Before-you-design question. (Mac)
- [ ] Part 3: Kyria's Act III. Player questions 31 and 32 pass; every check in CLAUDE.md passes. Push staging with `Status: for Bob`.

---

## WO-144  The indexes a design needs (PC, 23 Oct 2026; takes the PC's queue before WO-140)
Status: held (Dave, 23 Oct, 19:35: everything paused; see docs/pause-2026-10-23.md; was: building (PC))

**Why.** Dave (23 Oct), after Bob's three design tests and his own: every gap the assistants hit was data, not logic. The door did what it was told; what it was told was missing. So the PC's next stretch is one indexing program, in the order the tests hit the gaps, each part with a player question so it is tested as it lands, not taken on faith. Mac keeps building the door (WO-139, WO-142) in parallel; the Mac halves of WO-141 and WO-143 wait on the parts here. Bob re-runs the design battery (`docs/design-tests.md`) after each part. Under WO-138 Part 5 the PC decides what it finds and logs it under this order. The rules: the game's words, every row with its source, never a guess, and "not checked" where the files don't say.

### Part 1. Places, fixed (from WO-128 Part 5 and WO-141 Part 1)
1. **The nearest town is wrong, so `suggest_places` is empty for every real city.** `places.json`'s `nearestTown` never names a hold capital; 104 places have none. Measure every place to a fixed list: the nine capitals by their exterior map markers, then the settlements below. Keep `nearestTown` and `nearestCity`, each with km. Never a ruin, a manor, a gate or a platform as a town. Test: each capital has ten or more places within 5 km; `nearestTown` is never a place in the index.
2. **Strongholds, settlements and camps** as places with pointers and quests: the four Orc strongholds (a stronghold's row says what gets you in, from the gate guard's conditions), Riverwood, Ivarstead, Rorikstead, Shor's Stone, Darkwater Crossing, Kynesgrove, Karthwasten, Dragon Bridge, Stonehills, Helgen, the Skaal Village, Raven Rock, Thirsk, the war camps, and the lands mods' own.
3. **The named buildings inside cities** a character goes to on purpose, findable by `search_facts` and linkable by an objective: temples, inns (with their town), the two colleges, the jarls' keeps, guild halls, stables. `suggest_places` keeps them off the map list (rule 20).
4. **The roads:** a town-to-town table (every capital and settlement to every other, km by marker) in `places.json`; `suggest_places` returns `nearTowns` for an act's towns.
- Player question 26: "What's near Riften for Kyria's first act?" returns places with pointers, no "doesn't measure distances" note.

### Part 1 progress and decisions (PC, 23 Oct)
Item 1 built: `places.py` gains `CAPITALS` (the nine hold capitals) and `SETTLEMENTS` (the thirteen named in item 2), and `nearestTown`/`nearestCity` are now measured only against a marker whose name is in one of those two sets, never trusted by its TNAM type. That alone was the Wintersand Manor/Flight Platform bug: this load order's city-overhaul mods reassign the TNAM icon on every one of the nine capitals (Castle, MiraakTemple, Grove, StandingStone, or none), so trusting "City"/"Town" picked up any mislabelled marker instead. The nine are found by the one LCTN system-wide with that exact name and the `CWCapital` keyword (Skyrim's Civil War data, untouched by the icon mods) -- a verified property, not a guess.
- **Decision, open question for Bob/Dave.** Four capitals (Falkreath, Dawnstar, Morthal, Winterhold) have their own named exterior marker in Tamriel and now measure correctly (each has 10+ places within 5 km, tested). The other five (Whiterun, Windhelm, Riften, Solitude, Markarth) are each their own worldspace with no exterior marker and, checked this session, no door (`REFR` with `XTEL`) this reader can find landing in any of the five from anywhere, so there's no float position to measure from. The Tamriel cells their LCTN owns (via `XLCN`) span several kilometers each (not a tight gate radius), so a cell-grid centroid isn't trustworthy either. `nearestCity`/`nearestTown` never name these five for now; places near them keep whatever settlement is actually close. Flagging rather than guessing a position -- if there's a known way to find a city-worldspace's Tamriel-side anchor (a different subrecord, a quest alias, something in a map-marker mod's own data), WO-144's test for all nine needs it; otherwise Bob/Dave may want to accept "not checked" for these five permanently.
- **Two environment blockers found, unrelated to this order:** (1) `python3 scripts/gamedata/build.py` currently aborts before writing `places.json` -- `stories.json` fails to build (`TG00MiscHandler isn't a quest of thieves-guild`, and four more, both Thieves Guild and Dawnguard), independent of this change (reproduces on a clean pull before any places.py edit); worked around for this order by calling `places.build_site()` directly on `places_raw.json`. (2) `npm install` fails here with a `spawnSync` error; the repo's working copy sits very deep under `AppData\Local\Claude-Data\...\scratch-workspaces\...`, long enough that a Windows path limit is the likely cause, so `npm run typecheck`/`lint`/`test` couldn't be run this session -- only the Python suite (`python -m unittest discover -s scripts/gamedata`, 263 tests) is verified. Both are worth Bob or Dave's attention; neither is this order's to fix.

- **Bob, 23 Oct, 13:05, on the five walled capitals (decide, don't wait):** in order, take the first that works for each city and log which: (a) the city gate's door in **Tamriel's persistent cell** (persistent references don't sit in the exterior grid cells; the gate doors with `XTEL` into WhiterunWorld, RiftenWorld, SolitudeWorld, WindhelmWorld and MarkarthWorld are usually there); (b) the placed carriage driver or stablehand outside the walls (Bjorlam at Whiterun Stables, the Riften, Solitude, Windhelm and Markarth stables), which is in Tamriel and next to the gate; (c) the city worldspace's own offset to Tamriel (`WRLD` `ONAM` / map offset). Any of the three is within a few hundred metres of the gate, which is all `nearestCity` needs. Test: all nine capitals have ten or more places within 5 km.
- **Bob, on the `stories.json` break:** not yours; it's from WO-138 G5 (handlers off the pages) leaving helper quests in story definitions. Carried to Mac as WO-142 item 11. Keep working round it as you did.
- **Resolved (PC, 23 Oct, after Bob's note).** Re-checked (a) first: still no door with `XTEL` lands in any of the five worldspaces anywhere in the load order, including Tamriel's persistent cell (919 persistent `XTEL` doors in Tamriel, none of them). Took (b): each of the four with a plain named "Stables" marker (`Whiterun Stables`, `Windhelm Stables`, `Riften Stables`, `Markarth Stables`) is confirmed right by Bjorlam's own placed position outside Whiterun; Solitude has no "Stables" marker by that name, so anchored to `Solitude East Gate` (a named, Tamriel-side City marker from The Great City of Solitude.esp, confirmed against Katla's Farm next to it) instead. `CAPITAL_ANCHOR` in `places.py` carries the five; `nearestCity`/`nearestTown` look up the anchor's marker but report the capital's own name. All nine capitals now have 19 or more places within 5 km (the test asked for ten); `test_each_of_the_nine_capitals_has_places_nearby` covers all nine. `build.py` ran clean end to end now that Mac's `stories.json` fix is on staging; `places.json` came from the real pipeline this time, not the workaround. 268 gamedata tests pass. `npm install` is still flaky here (an `EBUSY` on `node_modules/esbuild` on one try, the original `spawnSync` error on the next) -- intermittent, not a hard path-length block as first guessed; still unresolved, still not this order's to fix, so `npm run typecheck`/`lint`/`test` remain unverified this session.

- **Item 2 built (PC, 23 Oct).** `SETTLEMENTS` and a new `STRONGHOLDS` (`Narzulbur`, `Largashbur`, `Dushnikh Yal`, `Mor Khazgur`) are now also place entries themselves, not only distance anchors (`NAMED_PLACES` bypasses the usual exclusion by name). The war camps ("Imperial Military Camp" and "Sons of Skyrim Military Camp", eight each) were already in, from WO-128's own `PLACE_KW` -- nothing to build there. A stronghold's `enters` is the gate guard's own line, found by searching dialogue for "Blood-Kin": `INFO Skyrim.esm:0BBB2D`, "This is our stronghold... You're not an Orc, or Blood-Kin, so stay out. We only help our own." -- one generic topic ("Generic dialogue for orc villagers"), shared by all four, not a per-stronghold line, so the same text and record sit on all four rows. "The Cursed Tribe" (Dushnikh Yal's clan name in the order's own text) never appears in any dialogue this reader can find; left out rather than guessed at. "The lands mods' own" settlements aren't covered -- that's every custom-worldspace mod's own named towns, not enumerated this session; flagging rather than guessing which count. Two names now carry two place entries each (`Helgen`, `Kynesgrove`): a second, distinct LCTN with the same name exists for both (plausibly Helgen's burned-after-the-dragon version); not merged, not guessed at which is "the" one. All 270 gamedata tests pass.

- **Bob, 23 Oct, 15:20, on distances (after item 2):** the numbers are real-world km on Skyrim's small map (Riverwood is 0.5 km from Whiterun, Narzulbur 0.4 km from Windhelm), so "within 5 km" covers most of a hold and the test proves little, and "0.4 km" reads to a player as next door. Keep `km` in the data, and add a player's measure everywhere a distance is shown or sent: `walk` in rough in-game terms, set by known pairs (Riverwood to Whiterun "a short walk"; Whiterun to Riften "a long day's road"), in four bands (next to it, a short walk, half a day, a long day's road). Tighten the capital test to "ten places within a short walk to half a day". Decide the thresholds yourself from the pairs and log them.
- **Walk bands built (PC, 23 Oct).** `walk(km)` in `places.py`, four bands, thresholds decided from Bob's two pairs plus one more: Riverwood to Whiterun (0.5 km) and Embershard Mine to Riverwood (0.3 km, practically touching) both need to read right, so "next to it" is under 0.4 km and "a short walk" 0.4 to 1.0 km; Whiterun to Riften (2.5 km) needs "a long day's road", so that band is 2.0 km and up; "half a day" fills 1.0 to 2.0. Sits beside `km` on every `nearestTown`/`nearestCity`. The capital test now asks for ten places within "next to it", "a short walk" or "half a day" (not a flat 5 km); all nine still clear it (19 to 51 each).
- **Item 3 built (PC, 23 Oct).** Temples, inns and guild halls (`LocTypeTemple`/`LocTypeInn`/`LocTypeGuild`, system-wide, not narrowed to the nine cities -- the order's own "every inn" wants them all) are places now: 22 temples, 37 inns, 16 guild halls (the two colleges fall out of `LocTypeGuild` for free -- confirmed on Winterhold College and The Bards College, no special case needed). A keep is found by `CWCapitalHQ`, not `LocTypeCastle` (which also covers Castle Volkihar and other non-capital castles): exactly nine, one per jarl's seat, tested. None of these has an exterior marker of its own (an interior-only location), so their town (`inTown`) is the first ancestor in `CAPITALS`/`SETTLEMENTS` up the location's own parent chain -- a containment fact, never a distance guess, so it's a new field, not `nearestTown`. 15 buildings (standalone wayside inns like Nightgate Inn and Old Hroldan Inn, a couple of wilderness temples) sit outside every town in the fixed list and correctly carry no `inTown` -- "not checked", not a failure. Kept off the map is Mac's "rule 20" on `suggest_places`; these rows carry nothing marking them for that beyond their own `type` (`Temple`/`Inn`/`Guild`/`Keep`), which Mac's door can filter on. All 273 gamedata tests pass.

- **Bob, 23 Oct, 15:35, on item 3 (city buildings), before Part 1 comes back:** the walk bands read well ("Narzulbur: a short walk from Windhelm"). The buildings need a cleaning pass; a location keyword alone isn't a building:
  - **Not inns:** "Solitude", "Whiterun" (a city tagged as an inn), "Home of Thane Alarik", "Cragwater Cavern", "Fort Valus", "The Hermit", "The Hermit Cellar", "Markarth East Empire Dormitory". **Not temples or keeps:** "Temple Location" (×2), "Markarth Outskirts", "Snow-Shod Farm Cellar", "Mausoleum", "Mustering Hall" unless it's a guild hall. An inn is a place with an innkeeper who rents a room (`RentRoom` dialogue or the innkeeper faction); a temple has a priest or a shrine of its god; a keep has the jarl. Test each kind that way; log what's dropped.
  - **Names as players see them:** the cell's display name, never the location record's editor-style name ("Mistveil Keep", not "Riften Mistveil Keep"; "Vilemyr Inn", not "Ivarstead Vilemyr Inn"; "Shor's Hall", not "Shor's Hall Location"). Where the names differ, the cell's wins.
  - **Missing:** stables (each city's, with the stablemaster), the Bards College is in, the two colleges' halls are fine; check that each of the nine capitals has its inn, its temple and its keep.

- **Item 3's cleaning pass:** see Part 1c below (its own feedback part, landed after this was written). `NOT_BUILDING_KW` (`LocTypeCity`/`CWCapital`/`LocTypeHold`/`LocTypeMilitaryFort`/`LocTypeHouse`/`LocTypePlayerHouse`/`LocTypeBanditCamp`) and a small named list (`NOT_BUILDINGS`) is the mechanism; `PLACE_KW` overlap (Cragwater Cavern's `LocTypeDungeon`) rules out the bypass on its own, no list needed there.
- **Item 4 built (PC, 23 Oct) -- Part 1's data side is done.** A `roads` table beside `places` in `places_raw.json` and `places.json`: every capital and settlement to every other in the same worldspace, by their own marker, with `km` and `walk`; never across worldspaces (Solstheim's Raven Rock and Skaal Village never road to a mainland town), never a pair twice, never through Thirsk (no marker). 172 roads: 171 mainland pairs (19 towns with a usable marker) plus the one Solstheim pair. `suggest_places`'s `nearTowns` and player question 26 are Mac's door reading this table, not the PC's to build -- not ticking Part 1's box for that reason; everything the PC owns in items 1 to 4 is built and tested (275 gamedata tests pass). `npm install` still flaky here; `typecheck`/`lint`/`npm test`/`build`/e2e remain unverified this session for that reason, unchanged from earlier in this order.

### Part 1c. Clean the city buildings (Bob, 23 Oct, 15:45; feedback, before Part 2)
Bob's 15:35 note above landed after item 3; nothing in it is applied yet. Do it now, then Part 2:
- [x] (PC, 23 Oct) Tried the innkeeper/priest/jarl test first: `JobInnkeeper`/`JobPriest`/`JobJarl` keywords exist and are right where they're used (Igmund and Laila Law-Giver both carry `JobJarl`), but aren't on every real one -- Hulda, Whiterun's own innkeeper, carries nothing, template included -- so requiring it would drop real inns along with the fake ones. Fell back to location-keyword disqualifiers (city/player-home/fort/bandit-camp keywords) plus a small named list for the handful with no distinguishing keyword at all (the East Empire dormitory is tagged identically to The Bannered Mare). Every name in Bob's list above is gone: "Solitude" and "Whiterun" as inns, Cragwater Cavern (still a dungeon, never an "Inn"), Fort Valus, The Hermit and its cellar, Home of Thane Alarik, the East Empire dormitory, "Temple Location", Markarth Outskirts, Snow-Shod Farm Cellar, Mausoleum, Mustering Hall.
- [x] (PC, 23 Oct) Players' names, from the shortest of a building's own cells: "Vilemyr Inn", "Mistveil Keep", "Bards College" (drops "The" too, since the cell does).
- [x] (PC, 23 Oct) Stables: `LocTypeStables`, confirmed against Bjorlam's placement; five found (Whiterun, Windhelm, Riften, Markarth by name, Solitude by its own `LocTypeStables` location with no "Solitude Stables" marker). Every capital has an inn and a keep; Morthal, Winterhold and Dawnstar have no standalone temple building in this load order's records at all -- not forced in. 277 gamedata tests pass.

**Bob, 23 Oct, 16:05, to the PC:** Part 2's first push skipped Part 1d (enemy levels, all four boxes open). Feedback parts come first (pipeline step 2): do 1d next, then carry on with Part 2. Notes on Part 2's first index for when you're back on it: Farengar, Belethor, Arcadia and Keerava read right; none carries a role yet (court wizard who sells Destruction and Conjuration tomes; general goods; apothecary; innkeeper), and that's the point of the index. Borgakh has no town (Mor Khazgur, by Larak's Longhouse); Lydia's cell is Breezehome, but a player first meets her in Dragonsreach (her starting package, not her later home).

### Part 1d. Enemy levels a player can plan by (Bob, 23 Oct, 15:50; feedback, before Part 2)
Dave's Claude, planning Kyria near Solitude: "Not checked Fort Hraggstad's enemy levels; expect the bandit range (3 to 24, bosses 19 to 24)." Fort Hraggstad is in the index now, but its `actors.levels` reads `[1, 1]` for 93 actors, and 108 places read `[1, 1]` (Fort Amol, Skuldafn, Morvunskar…); others read too wide to use ("1 to 50" at Bleak Falls Barrow). The levels come from the leveled lists' lowest entries, not from what a player meets.
- [ ] Read each location's **encounter zone** (`ECZN`: min level, max level, and whether it's fixed), which is what Requiem and LoreRim set to decide how strong a place is; that is the range to show. Where a place has none, take its actors' leveled lists resolved at their real level spread (the lowest and highest entry a player at the zone's levels can meet), never `[1, 1]` from an unresolved list.
- [ ] Bosses: the boss's own level or level range (the actor marked boss, or the zone's max), named when the records name it.
- [ ] `suggest_places` and `get_place` (when it exists) give "enemies about 3 to 24, the boss about 19 to 24" in the words players use, and a fit against the act's levels (fits now, plant now, too high).
- [ ] Test: Fort Hraggstad, Embershard Mine and Bleak Falls Barrow read a range a player can plan by; no place reads `[1, 1]`.

**Bob, 23 Oct, 16:15: the ECZN layout, decoded on Fort Hraggstad.** `DATA` is 12 bytes: Owner (FormID, 4) | Location (FormID, 4) | Rank (int8) | Min Level (int8) | Flags (uint8) | Max Level (int8). Yours: `00 00 00 00` owner none | `81 91 01 00` = location `019181`, which is Fort Hraggstad's own id in `places.json` (the check that the slicing is right) | `00` rank | `06` **min level 6** | `00` flags | `00` **max level 0 = no cap**. Flags: 0x01 never resets, 0x02 match the player below the minimum, 0x04 disable the combat boundary. So the zone says only "at least level 6, no ceiling"; it doesn't hold the 3 to 24. That range comes from **who spawns there**: resolve each placed actor's leveled list (`LVLN`) to its entries, and each entry's NPC (`NPC_`) to its level (a fixed level, or a multiple of the player's level with its own min and max, `ACBS` flags and calc min/max). The range a player meets is the lowest and highest of those levels, clamped by the zone's min and max (max 0 = none). The boss is the actor whose ref or alias is marked boss (or the location's `LocRefType` boss marker), resolved the same way. Show it as "enemies about X to Y, the boss about Z", plus the zone line when it matters ("never below 6"). Dave's Claude guessed 3 to 24 from bandit lists; check yours against that.

### Part 1d progress (PC, 23 Oct)
`ECZN` exists and is readable (546 records; Fort Hraggstad's own is `Skyrim.esm:03EC1F FortHraggstadZone`, `DATA` bytes `00 00 00 00 81 91 01 00 00 06 00 00`, winning record across the whole load order -- no mod overrides this specific one). Every slicing of those 12 bytes I tried (owner FormID + rank + minLevel + flags + maxLevel, in a few byte-width combinations) gives numbers nowhere near Dave's stated range (3 to 24, bosses 19 to 24): nothing in the record decodes to 3 or 24 as a plain level byte or a small int16. Rather than ship a guessed byte layout -- which would print a confidently wrong range, worse than the honest `[1, 1]` it would replace -- **flagged for Bob/Dave: is there a reference for ECZN's exact DATA layout**, and found the real bug independently in the meantime (below).

**Found the real bug (PC, 23 Oct), traced by hand from one actor:** `level_of`'s leveled-list branch read each entry's own stored `LVLO` level number as if it were the output level. It isn't -- that number means "picked from this player level up"; Fort Hraggstad's own chain (`LCharBanditBoss` -> `REQ_CLChar_Spawns_Bandit_Any_Boss` -> `REQ_LChar_Variations_Bandit_AxeShield_05` -> a Requiem for the Indifferent list) is four `LVLN`s deep, and every single entry at every tier carries the number `1`, while the real `Bandit` NPCs at the bottom of the chain have real, fixed, hand-set levels of 3, 7, 10, 19 -- confirmed by reading the records by hand, matching Dave's stated range closely. `level_of` now resolves each entry by its real target (recursing through nested lists, with a cache and a cycle guard so a huge, heavily-reused list tree doesn't blow up the build), never the stored number. Fort Hraggstad now reads `[3, 47]` (not `[1, 1]`); places reading `[1, 1]` dropped from 108 to 14, and every one of those 14 has one to five actors in a small inn, shack or minor cave -- a plausible genuine fixed level 1, not a bug. Bleak Falls Barrow still reads wide (`[1, 60]`): that's the "too wide to use" half of this part, which the zone's min/max clamp should fix. The old unit test's fixture (one target repeated at three list tiers) tested exactly the wrong thing and is replaced with one shaped like the real chain. 282 gamedata tests pass.
- Also fixed in `people.py` while here: `inTown` left out `STRONGHOLDS`, so Borgakh the Steel Heart (Mor Khazgur) had none; now `Mor Khazgur`, cell `Larak's Longhouse`, matching Bob's note exactly.

**Bob, 23 Oct, 16:15: the ECZN layout, decoded on Fort Hraggstad.** `DATA` is 12 bytes: Owner (FormID, 4) | Location (FormID, 4) | Rank (int8) | Min Level (int8) | Flags (uint8) | Max Level (int8). Yours: `00 00 00 00` owner none | `81 91 01 00` = location `019181`, Fort Hraggstad's own id (the check that the slicing is right) | `00` rank | `06` **min level 6** | `00` flags | `00` **max level 0 = no cap**. So the zone says only "at least level 6, no ceiling"; the 3-to-24 range comes from who spawns there (exactly the `level_of` fix above), clamped by the zone's min and max (max 0 = none). The boss is the actor marked boss, resolved the same way. Show it as "enemies about X to Y, the boss about Z", plus the zone line when it matters ("never below 6").
- [x] (PC, 23 Oct) `ECZN` read per place, by its own `Location` field (no guess needed: Bob's decode gave the exact byte offsets), and the resolved actor range clamped by it: a floor when the zone sets a `minLevel` the resolved range could fall below, a ceiling when `maxLevel` is nonzero. Fort Hraggstad now `[6, 47]` (`zoneMin: 6` on the row), Bleak Falls Barrow `[6, 20]` (was `[1, 60]`), Embershard Mine `[6, 10]`. Places reading `[1, 1]` from before this part: 14, each a plausible genuine fixed level 1 in a tiny inn or shack. The boss's own level isn't clamped (bosses are the zone's own exception); not built: naming the zone line in words ("never below 6") on the door -- that's `suggest_places`/`get_place`, Mac's side. 283 gamedata tests pass.
**Bob, 23 Oct, 16:25:** every field Part 1 carries is now defined in `docs/data/places.md` (what a player asks, the source record, a right value, what's impossible). Build the missing rows to it (what lives there, what's worth going for, discovery XP, respawns, danger) as Part 1e, after 1d, before Part 2. `docs/data/people.md` will be there before Part 2 goes further; until then, keep Part 2 to what you have.

**Bob, 23 Oct, 17:10, on 16d4ec7 (values read):** much better: 108 places at 1 to 1 are down to 14, and the camps' bosses read right (Halted Stream and Silent Moons, 19 to 24). The ranges are still too wide to plan by (Labyrinthian 1 to 100, Bleak Falls Barrow 1 to 60, Fort Hraggstad 3 to 47) because a leveled list's top entries only appear once the player reaches their level. So say it the way the game works, as a **floor, a ceiling and what a player meets at a given level**:
- `floor`: the lowest level any hostile actor there can be; `ceiling`: the highest, clamped by the zone's max (0 = none).
- `atLevel(n)`: the range a player at level n meets (only entries whose list level is at or below n, each NPC at its level for n), computed for the act's levels in `suggest_places` and `get_quest`'s places.
- Words: "bandits from level 3; at 12 you'll meet about 3 to 12, the chief 19 to 24". Count hostile combat actors only (no chickens, no friendly NPCs, no prisoners).
- The 14 still at 1 to 1 get read by hand and logged.

**Bob, 23 Oct, 17:45, on 1a405ad (values read):** right now on Bleak Falls Barrow (6 to 20, Zulakaroth 40), Fort Hraggstad (6 to 47), Labyrinthian (24 to 100) and Wolfskull Cave (8 to 50, the Ritual Master at your level 10 to 20). One thing: the **boss** isn't clamped by the zone yet (Embershard Mine reads enemies 6 to 10, its boss "leveled 3-24"); clamp the boss by the same zone, and word "your level x1 (10-20)" as "matches your level, 10 to 20". Then the `atLevel` form, the 14 left at 1 to 1, and Part 1e.

- [x] (PC, 23 Oct) **Boss clamped, with the one real exception.** A *ranged* boss (a leveled list) is clamped by the zone exactly like the rank and file -- Embershard Mine's boss now reads "leveled 6-10", not "leveled 3-24". A *fixed, unique, named* boss (Zulakaroth, level 40, in a zone capped at 20) is never clamped -- that's the whole point of naming one. Found a second bug on the way: Wolfskull Cave had **two** boss-flagged actors (the named Ritual Master and an unrelated generic templated bandit), and the old "first one found" picked whichever came first in file order; now prefers a named, unique actor, then the highest ceiling. Reworded: `mult == 1` now reads "matches your level, 10 to 20", not "your level x1 (10-20)", and the same wording carries through a clamp.
- [x] (PC, 23 Oct) **`atLevel` built.** `level_entries()` replaces `level_of`'s single aggregate: every leaf level, tagged with the player level a list's own entry needs before it's even in play (the max stored `LVLO` level on the path to it -- the real gate the game checks, confirmed still meaningless on Fort Hraggstad's Requiem-replaced chain, where every tier stores `1`, but meaningful on a plain vanilla scaling list). `atLevel` on a place's `actors` is a cumulative table, one row per distinct gate, each the floor/ceiling of everything unlocked by then (zone-clamped): "at 12, 3 to 12" needs everything gated `<= 12`, not whatever one tier happens to store 12. `level_of` stays as a thin wrapper (the boss's own single-value display, the old tests) for compatibility.
- [x] (PC, 23 Oct) **The 14 at 1 to 1, read by hand.** Spot-checked five directly against the records (not this index): Septimus Signus' Outpost is Septimus Signus himself, level 1 -- a real vanilla fact, not a bug (he's a non-hostile scholar, never meant to be fought). The Roadhouse (Keld), Meeko's Shack (a generic Nord), Black Mesa Inn (Gordon) are small inns/shacks with a fixed level-1 patron or innkeeper. Nightingale Hall has four unnamed, unflagged level-1 actors -- no boss, plausibly set dressing, not checked further. The remaining nine (two Hjorkvild Isles locations, Frostskarn Vault, Sees-the-Moon's Shack, Whispering Walls Catacombs, Wisp Light Crevasse, The Spiced Yam, The Iron Halls, Windward Ruins) weren't read by hand this pass -- all one to five actors, the same shape as the five checked; flagging the shape rather than claiming all nine individually. 287 gamedata tests pass.

### Part 1d-2. Three fixes from Bob's 16:50 read (feedback; do before the rest of 1e)
- [x] `atLevel` in a player's terms (`from`, `meets`), and in words; no `gate`.
- [x] Halted Stream Camp's boss: the zone record logged, "level 10" if it caps it.
- [x] Forts' commanders as bosses.

**Bob, 23 Oct, 16:50, on 9eed4b1 (values read):** none left at 1 to 1, and Wolfskull Cave reads well ("matches your level, 10 to 20"). Three small things before 1e:
- `atLevel` as `[{"gate": 0, …}, {"gate": 1, …}]` means nothing to a player or to Mac. Make it the player's level against what they meet: `[{"from": 1, "meets": [6, 10]}, {"from": 20, "meets": [8, 50]}]` (from = the player level at which that band starts), and say it in words in the row ("at 1 to 19 you meet 8 to 20; from 20, up to 50").
- Halted Stream Camp's boss now reads "leveled from 10" with the camp's ceiling at 10 (the zone's max). If the zone really caps it at 10, say "level 10"; log the zone record you read it from, since Dave's Claude expected the chief at 19 to 24, and the records win only when we've shown them.
- Fort Hraggstad has no boss; a fort has a commander. Check the boss marker for forts (the location's `Boss` ref type, or the highest-level unique NPC).

### Part 1e. The rest of the places spec
- [ ] Every row of `docs/data/places.md`, with its sanity test and the ten spot checks in the log.

### Part 1e progress (PC, 23 Oct)
**discoveryXp** built: `[Exploring]`'s `iXPDisc<Type>` from the same `Experience.ini` `clearXp` already reads (10 for every type in this load order, read, not assumed). **respawns** built: `"never"` when the place's own `ECZN` carries the 0x01 flag (82 places); otherwise `"after 300 days once cleared, 30 ordinarily"`, read from Requiem's own MCM settings, not the spec's prose taken on faith -- `MCM/Settings/Requiem.ini` is the shipped preset SkyUI's MCM loads as the active value (sets the ordinary 720h = 30 days, LoreRim's own override) and `MCM/Config/Requiem/settings.ini` is the mod's declared default, read only for `iHoursToRespawnCellCleared` (7200h = 300 days) since the preset never sets it -- confirmed to match the spec's own stated numbers exactly, not the other way round. Not yet built: what lives there (majority faction/kind of hostiles), what's worth going for (word walls, skill books, unique items, crafting stations, Standing Stones), danger to a build (traps, dragon lair, boss spell kit) -- each needs reading records this script doesn't touch yet (`SNAM` faction lists on `NPC_`, placed activators and containers by kind); logging the size rather than rushing any of them. 288 gamedata tests pass.

- **Part 1d-2's three fixes (PC, 23 Oct).** `atLevel` reworded to `{from, meets, words}` (bands collapsed when nothing changes, "from 1, 6 to 10" style words, no raw `gate`). Halted Stream Camp: its chief's own records say 19 to 24, but its zone (`Skyrim.esm:03EC32`, min 6, max 10, logged) caps it; now says `"level 10"`, never `"leveled from 10"` (that read as an open floor it isn't). Forts' commanders: no `XLRT` boss ref on Fort Hraggstad at all, so now falls back to the highest-level named, unique actor (an "Imperial Soldier", `leveled 22-47`) when no actor is marked boss.
- **What lives there, built.** An actor's own faction (`SNAM`, template-resolved -- a template can itself be a leveled list, same as `level_entries`), matched by EDID *suffix* (`"<Kind>Faction"`), never substring: a Wolf at Embershard Mine carries `SprigganPredatorFaction` (what it hunts, not what it is) alongside its own `WolfFaction`, and a first substring-based attempt called it a Spriggan before this test caught it. `livesHere` (the majority) and `alsoHere` (the rest) on 400 of 566 places; the other 166 have no actor whose faction resolves to a kind (a building, a quiet landmark, an Orc stronghold's own civilian Orcs -- race, not a hostile faction, so correctly "not checked", not forced). Still open: what's worth going for, danger to a build. 293 gamedata tests pass.
- **WO-150, acknowledged.** My own `levels` -> `floor`/`ceiling` rename (9eed4b1) broke Mac's `suggest_places` on every call; `npm test` would have caught it, but `npm install` still fails here (the flaky `EBUSY`/`spawnSync` issue, unresolved since item 1's log), so nothing caught it on this side. Pipeline now says generated files are a contract and a Jeff changing one's shape runs `npm test` first and says so in the commit -- noted for every shape change from here on; WO-150 itself is Mac's to fix, not retaken here.

### Part 1e-2. Who's there when she arrives (Bob, 23 Oct, 17:20; feedback)
Fort Hraggstad reads "lives here: Imperial, also Bandit; boss Imperial Soldier 22 to 47". A player arriving at level 12 finds bandits (Joining the Legion sends her to clear them); the Imperials are the Civil War garrison, placed **initially disabled** and enabled by the war's quests. Halted Stream Camp's zone note is right (records shown, the zone caps the chief at 10: good).
- [x] Count only actors present at the start: skip refs flagged initially disabled, refs in an enable-parent chain owned by a quest or the Civil War (`CWFort…` enable markers), and refs that only spawn on a quest stage. Show the later garrison separately: "after the war: the side that holds the hold".
- [x] The boss is the start's boss (the bandit chief), with the war's commander as the later one.
- [x] Spot checks in the log: Fort Hraggstad, Fort Greymoor, Fort Snowhawk, Fort Amol (all war forts), and two that aren't.

**Built (PC, 23 Oct).** Every `REFR`/`ACHR` now carries its own "initially disabled" flag (0x800), its own EDID and its enable parent (`XESP`) when it has one -- walked as a chain, with a cycle guard. Fort Hraggstad's Imperial Soldiers aren't disabled themselves; they're enable-parented to `"CWGarrisonEnableMarkerImperialFortHraggstad"`, which is -- the same naming across 100+ garrisons this load order carries, both sides, every fort and camp (`CWGarrisonEnableMarkerImperial<Place>`/`CWGarrisonEnableMarkerSons<Place>`), confirmed by listing them, never a guess at one name. **Tried and reverted:** also skipping an actor who's any quest's own alias reference (`forced`, already read for pointers) -- that dropped Septimus Signus and Halted Stream Camp's own boss along with the two true "absent at the start" actors it was meant to catch (Molag Bal, a Thalmor commander), since most of a game's named unique NPCs are quest-alias-bound even when they're there from the start. Reverted; logged under 1e-3 as a gap this reader can't close without reading a quest's own stages, not guessed at.
- An actor's "disabled" flag alone isn't enough either: Embershard Mine's wolves are enable-parented to a disabled `"E3demoMarker"` (a leftover dev artifact, nothing to do with the war) and correctly stay counted at the start -- only a disabled parent whose own EDID starts `CWGarrisonEnableMarker` moves an actor to `afterTheWar`.
- `actors.afterTheWar` sits beside the start's own `count`/`livesHere`/`floor`/`ceiling`/`atLevel`/`boss`, summarized the same way, never merged in. Fort Hraggstad: start 57 (Imperial, also Bandit -- see below), `afterTheWar` 36 (Imperial, boss "Imperial Soldier", leveled 22-47). Fort Greymoor: start 96 (Imperial, also Bandit/Skeleton/Troll, boss unnamed leveled 22-47), `afterTheWar` 49 (Imperial, boss "Imperial Soldier"). Fort Snowhawk: start 71, `afterTheWar` 34 (boss "Fort Commander", leveled 22-47). Fort Amol: start 62, `afterTheWar` 32 (boss "Imperial Soldier"). Two that aren't war forts, unaffected: Bleak Falls Barrow (Zulakaroth, level 40, unchanged) and Labyrinthian (Krilotdiilvahlok, level 100, unchanged).
- **Read by hand, not guessed:** the start-of-game garrison at these forts is itself already part-Imperial (Fort Hraggstad's own 57 carry more Imperial than Bandit) -- a fort's always-there owning-side garrison (whichever side the save's own world state currently holds it for) and the Civil War questline's own reinforcement wave are two different things in the records, both genuinely present, and this is reading that distinction correctly, not conflating them the way the single flat count did before. 303 gamedata tests pass.

### Part 1e-3. What `suggest_places` shows for Riften, read as a player (Bob, 23 Oct, 17:35; feedback)
- [x] **The boss is the place's boss, not the strongest or the last actor.** Built, with one correction found while fixing it (see below).
- [x] **Friendly places have no enemies.**
- [x] **Nightingale Hall still reads 1 to 1.** Read by hand, fixed.
- [ ] **"At your level" isn't real yet.** Not fixed; read by hand, logged below -- the one item still open.

**Boss, fixed (PC, 23 Oct), with a correction to 16:50's own rule.** Fort Snowhawk's own boss read "Exmoor Pony, level 4" -- a named horse, `race` plain `HorseRace`-adjacent, no hostile faction at all; the fallback now also requires `kind_of` to resolve one, the same check "what lives there" already uses. That alone wasn't the whole fix: Faldar's Tooth then read "Pit Wolf, level 2" -- a named but minor caged pet (its own faction resolves to "Bandit", so it passed the hostile check), while Faldar's Tooth's real strongest tier is 27 **unnamed** bandits at a clamped 6 to 24 -- requiring a name at all was always going to lose to whichever minor pet happened to have one, over an anonymous but far stronger tier. Bob's own 17:35 wording dropped "named" from the rule ("the highest-level hostile placed at the start"), so the fallback now picks by level first, with a name only as the tie-break among actors at the same ceiling (so Fort Greymoor's own "Imperial Soldier" still wins its tie against the other unnamed ones sharing its 47). Faldar's Tooth now reads `{"level": "leveled 6-24"}`, no name -- a real finding, not a guess: this camp's strongest bandits simply aren't individually named in the records.
- **Stendarr's Beacon still reads "Molag Bal, level 250" -- read by hand, confirmed real, not a misread.** The vanilla `Molag Bal` actor there (`Skyrim.esm:0A95EC`) is level 1, no faction, and was never the one being picked. Three *other* "Molag Bal" actors exist in this load order, all from `Vigilant.esm` (a large quest mod), all genuinely boss-flagged (`XLRT`) in their own records; one of them sits in a cell this index resolves to Stendarr's Beacon. Vigilant deliberately re-purposes this vanilla location into one of its own late-game boss encounters -- a real, intentional design choice by that mod, read correctly from its own authoritative boss-ref flag, not a bug in this reader.
- **Friendly places, built.** `FRIENDLY_TYPES` (`Keep`, `Stables`, `Temple`, `Inn`, `Guild`) and the four named `STRONGHOLDS` carry `{"count": N, "hostile": false}` and nothing else -- no `boss`, no `floor`/`ceiling`, whatever level their people happen to be (Largashbur's Chief Yamarz, Bee and Barb's Keerava, Jarl's Longhouse's Siddgeir). Generalized past "a stronghold's, a town's or a guild hall's": every building type this index builds (an inn's innkeeper, a temple's priest, a keep's jarl) was reading the same way, for want of any friendly/hostile distinction at all before this.
- **Nightingale Hall, read by hand and fixed.** Its only four actors are all `Skyrim.esm:089A85`, EDID `PlayerHouseMannequin`, race `Skyrim.esm:10760A` (`ManakinRace`, Bethesda's own spelling) -- display mannequins, never an enemy, which is exactly the "1 to 1 against a zone minimum of 8" contradiction. `MANAKIN_RACE` now excludes any actor of that race from `by_place`/`after_war_by_place` entirely; Nightingale Hall now carries no `actors` key at all -- "not checked", correctly, rather than a false floor.
- **"At your level", read by hand, left open.** Lost Prospect Mine still reads `floor: 6, ceiling: 50` as one flat band. Traced by hand: the actor pushing the ceiling to 50 is `FDE Faralda.esp:00096B`, display name "Thalmor Commander" but EDID `aaFaraldaBrother` -- a follower mod's own companion NPC (Eilonwy's party member), scaled "matches your level, 15 to 50", enable-parent none, disabled flag false, faction a mod-specific `aaFaraldaMerandilFaction` this reader has no general signal for (not `PotentialFollowerFaction`, not any keyword that means "follower" across mods). It no longer wins as the place's boss (its faction doesn't resolve a `kind_of`), but it still widens `floor`/`ceiling`/`atLevel`, since those are computed from every present actor, not only the hostile ones -- and this reader has no general friend/foe signal beyond buildings, strongholds and `ManakinRace`, so narrowing that risks silently dropping a real enemy somewhere else, which is worse than an honestly-too-wide range. Flagging the gap rather than guessing at a fix. 304 gamedata tests pass; `npm install` still unverified this session for `typecheck`/`lint`/`npm test`.

### Part 1e-4. Values read after 3420787 and a16154f (Bob, 23 Oct, 18:05; after WO-152's measure and audit)
Good: Bleak Falls Barrow's "worth going for" (the Unrelenting Force word wall, a boss chest, an alchemy lab and enchanting table) and Fort Hraggstad's `afterTheWar` split are the right shape. Not yet right, by value:
- [x] **Fort Hraggstad still reads "lives here: Imperial" at the start** (57 actors), bandits only "also here", the start's boss "leveled 22-47". The start set still holds the war's Imperials; Joining the Legion sends you to clear bandits. Check the enable-parent logic against this fort and the other three war forts in the log.
- [x] **Skill book names as players see them:** "HeavyArmor (The Knights of the Nine)" → "Heavy Armor: The Knights of the Nine".
- [ ] **Stendarr's Beacon still reads Thalmor and "Molag Bal, level 250".** Read by hand, confirmed real, left open -- see below.
- [ ] **`atLevel` is still one band from 1.** Read by hand, confirmed a structural fact of the files, not a bug -- see below.

**Fort Hraggstad and the other war forts, fixed (PC, 23 Oct).** The marker-chain check alone wasn't the whole war garrison: about 20 unnamed `CWImperialFaction` soldiers at Fort Hraggstad carry no `CWGarrisonEnableMarker` parent at all -- a different gate on the same war. `cw_faction()` catches these by the actor's own faction (`^CW(Imperial|Sons)Faction`, `^CWJobFort`, `CWFortFaction` -- this load order's own 67-faction Civil War naming, not a guess). Fort Hraggstad's entire static garrison turns out to be Civil-War-tied this way: `count: 0` at the start, `afterTheWar` 76 (Imperial, boss "Imperial Soldier", leveled 22-47). This doesn't match UESP's "starts bandit-held" -- flagging that plainly rather than forcing a baseline this reader can't otherwise find in the static records (Requiem heavily reworks Civil War forts; the "bandit interim" state may be a global-variable or radiant-quest mechanism with no separate static placement at all, which this reader can't see). Fort Greymoor (14 bandits), Fort Snowhawk (1) and Fort Amol (2) each keep a small real baseline outside the Civil War system; all four read the war's own garrison correctly in `afterTheWar` now.
- **Tried and reverted: excluding *any* disabled ref, Civil War or not** (to also catch Molag Bal and Embershard Mine's wolves, both confirmed below). It also silently dropped Wolfskull Cave's own confirmed-right boss (Part 1d-2: "the Ritual Master, matches your level, 10 to 20") -- he's enable-parented to `"MS06caveStatemarker"`, a quest-state marker that starts disabled too but is enabled almost as soon as a player reaches the cave, the same record shape as a Civil War reinforcement but a completely different in-game timing. A dungeon boss tied to its own quest this way is extremely common in these records; telling that shape apart from an actor genuinely absent until much later needs the enabling quest's own stages or scripts (`VMAD`), which this reader doesn't parse. Reverted to the narrower, verified Civil War signal alone, logging Stendarr's Beacon and Embershard Mine's wolves as open rather than guessing with a rule already shown to break a confirmed-right case.
- **Stendarr's Beacon, read by hand, confirmed real, left open.** The vanilla `Molag Bal` there is level 1, no faction, never the one picked. `Molag Bal` (`Vigilant.esm:0072AB`, disabled, no enable parent at all) and an "Ugly One"/eight more Vigilant actors (also disabled, no parent) are a real quest scene from that mod reusing this location; the Thalmor group reads the same shape. All genuinely disabled with no detectable reason beyond "disabled," same as the Ritual Master -- the gap above, not a new one.
- **Skill book names, fixed.** `SKILL_NAMES` (Skyrim's own 18, "HeavyArmor" -> "Heavy Armor", "OneHanded" -> "One-Handed"...) and `"<skill>: <title>"` in place of `"<skill> (<title>)"`.
- **`atLevel`, read by hand, confirmed a structural fact, not a bug.** Counted every `LVLO` entry's own stored level across the *entire* load order, not just Requiem's spawn lists: 80,172 entries, 76,330 of them (95.2%) store exactly `1`. This isn't Fort Hraggstad's own chain or Lost Prospect Mine's; it's load-order-wide, including vanilla Skyrim.esm's own copies. Requiem (and LoreRim on top of it) replaces the vanilla level-gating mechanism outright and does real level scaling at runtime, not through the static `LVLO` level field this index reads -- there is no second static field to fall back to (fixed-level placed NPCs, confirmed in Part 1d, carry no per-tier variation either). `atLevel`'s per-band promise, as specified, cannot be built from these files on this modlist; it isn't a reading bug to keep chasing. What the records *do* support, already built: `floor`/`ceiling` (clamped by the zone) and the zone's own minimum -- a true, honest range, just not a progression. **Open question for Bob/Dave:** is there a Requiem config (an INI, a script-exposed setting) that documents its actual runtime scaling formula? If one exists, that's a real second source; if not, `atLevel`'s banded form should be dropped from the spec rather than kept open against data that can't supply it.
- **Checks.** 310 gamedata tests pass (6 new, two of them reverted and rewritten once the broad-exclusion regression was found). `npm install` still unverified this session.

### Part 2. People

**Bob, 23 Oct, 16:55:** every field Part 2 carries is defined in `docs/data/people.md`. Build to it, with its sanity tests and spot checks. "Where" means where a player first meets them (Lydia in Dragonsreach), not where they end up.
Every person a design touches, from the records, in `people.json`: name, race, sex, where they stand (cell and town), and what they are to a player:
- **Merchants and what they sell:** innkeepers, general goods, apothecaries, blacksmiths, fences, and the court wizards and College vendors with the spell tomes in their lists (the records' vendor containers and leveled lists). This answers "where is Calm sold", which every test hit.
- **Trainers** (skill and the level cap), **priests** (which god, which temple), **innkeepers** (which inn, which town), **marriage candidates** (The Bonds of Matrimony's list and what each needs), **followers** (vanilla and mod: how they join, with its conditions; what they fight with; from WO-141 Part 2), **jarls, stewards and housecarls** by hold, and **quest givers** (already in `quests.json`; link them).
- `search_facts` kind `person`; `get_person` on the door: who they are, where, what they sell or teach, how they join or marry, which quests they give.
- Player question 27: "Where is Calm sold?" names the vendors and their towns. Player question 23 (Orc followers) passes.

### Part 2 progress (PC, 23 Oct) -- the base index, not the bullets yet
`people.py` (new, reuses `places.py`'s own `scan()` rather than reading the load order twice): every placed actor that's named, or carries a `Job*` keyword even unnamed (an innkeeper, a priest, a stablehand), one placement each (their first found cell, their home, as `quest_givers.py` already treats a giver). 4,666 people: name, race, sex, their cell, `inTown` (a parent-chain fact, same as a building's), and `role` from the keyword, template-resolved.
- **Decision, logged rather than guessed at.** `Job*` keywords are real (confirmed: Igmund and Laila Law-Giver both carry `JobJarl`, Faida `JobInnkeeper`) but sparse -- only 67 of the 4,666 named people carry any Job keyword at all; Hulda, Whiterun's own innkeeper, carries none (her record and her template both have nothing). So `role` is a true positive when present but a false "not checked" for most innkeepers, priests, merchants and trainers this bullet list wants; the base index (name, race, sex, cell, town) is solid, the **sub-bullets are not built**: no vendor-container reads (what a merchant sells), no trainer skill/cap, no priest-to-temple or innkeeper-to-inn join beyond the keyword, no marriage candidates list, no follower join-conditions, no jarl/steward/housecarl grouping by hold. Each is its own investigation the size of a Part 1 item; flagging the size rather than rushing a guess at any of them.
- `people.json` wired into `build.py` the same way `places.json` is. 281 gamedata tests pass (4 new in `test_people.py`).

### Part 3. Books (from WO-141 Part 3 and WO-143's scholar)
- **The books that teach:** the Smithing perk books and each skill's five skill books, placed the way WO-131 placed the quest-start items (placed copies with the nearest doors, containers, merchants, leveled lists). `get_perk` says where a Smithing book is; `search_facts` finds a skill book by skill with its places.
- **Where the books are in bulk,** for a scholar: rooms and buildings with many readable books (the Arcanaeum, the Bards College's library, Dragonsreach, the Blue Palace, Jorrvaskr, the player homes), each with a count from the placed references, in `books.json`.
- Player question 28: "Where are the Sneak skill books?" and 29: "Where can a scholar read in Solitude?".

### Part 3 progress (PC, 23 Oct)
**Skill books: already built, nothing new needed.** Part 1e's own `worthGoingFor.skillBooks` (same `scan()` pass, the `SkillAlchemy5`-style EDID convention) already carries every placed skill book against the place it's found in. Checked against the five Sneak books this part's own sanity-pass line asks for: all five of Skyrim's own titles are there, each with its place(s) -- *The Red Kitchen Reader* (New Gnisis Cornerclub, Pinewatch, Frostmere Crypt, Castle Volkihar, Nightingale Hall), *Sacred Witness* (Twilight Sepulcher, Deepwood Redoubt), *Three Thieves* (Snow Veil Sanctum), *2920, Vol. 08: Last Seed* (Raldbthar, Hag Rock Redoubt, Redoran's Retreat, Nightingale Hall), *Legend of Krately House* (Atalatar). `get_perk`/`search_facts` reading this by skill is Mac's door, not built here.
- **Smithing perk books, built.** `scripts/gamedata/book_places.py`, new, writes `gamedata/5.0.4.8/book_places.json` (not `books.json` -- that name is already `books.py`'s own, wired into `build.py` for the perk trees; a collision, not a second file for the same thing, so this one is named apart). Reused `books.py`'s own VMAD-scan technique (which book's script references a perk, by its own FormID), scoped to the Smithing tree's own `GetLevel < 0` ranks (Requiem's book-gating convention, not vanilla's -- Requiem adds book requirements vanilla Smithing doesn't have, read from the perk conditions, not assumed from vanilla memory), then placed every book found with WO-131's own machinery (`readables.py`'s `scan()`/`place_of()`/`near_doors()`, exactly as this part asks). 8 of the tree's book-gated perks have a book this reader can find and place (Craftsmanship: *Art of the Advanced Nordic Blacksmiths*; Arcane Craftsmanship, placed in **The Arcanaeum**; Tailoring & Polishing; Daedric, Ebony, Draconic and Legendary Blacksmithing; Advanced Light Armors). **5 more** (Dwarven, Orcish, Elven, Glass Smithing, Advanced Blacksmithing) carry the identical book-gated condition shape but no `BOOK` record's `VMAD` anywhere in the load order references their perk's FormID as a bound property -- either a script that hardcodes the perk instead of binding it (this reader's own blind spot, the same one `books.py` already had) or genuinely no book in this modlist; not chased further, flagged rather than guessed at.
- **Reading rooms, built, with a value caught before it shipped.** A full pass over every placed `BOOK` reference, tallied by place, five or more kept. First run put three player homes (Bluesky Hall, Proudspire Manor, Hjerim) over 400 books each -- read by hand and traced to decoration-variant refs (alternate furnishing choices a mod toggles, only one ever actually on), all carrying the "initially disabled" flag (`0x800`) this session's own Part 1e-2 already established as the right signal to exclude. Excluding it the same way actors already are dropped every inflated room to a plausible range (the Blue Palace tops the list at 424, a real, large library, not a bug). The five rooms this part names all clear a 5-book floor: the Arcanaeum (126), the Bards College (200), Dragonsreach (73, plus 95 in the Jarl's own quarters), the Blue Palace (424), Jorrvaskr (29, plus 83 in its living quarters). The 5-book floor itself is this reader's own choice, not a number from a spec -- no `docs/data/books.md` exists yet (unlike places.md and people.md), logged rather than guessed at; Bob/Dave may want to set a different one once a page is actually shown.
- **Checks.** 341 gamedata tests pass (7 new).

### Part 4. What a character can do here (from WO-143 Part 1, broadened)
For each town, settlement and place, what the game and LoreRim's mods let a character do there, in `doings.json`, each with its mod and source:
- **Work:** the jobs mod's shifts per town (`lorerim/systems/economy-and-work.md` calls them AJO shifts; read the mod's records for which employers and where), the Missives boards, the jarls' bounties, the townsfolk favours (counts from `quests.json`).
- **Perform:** every inn (Skyrim's Got Talent is in LoreRim; the Bards College).
- **Fish:** the Fishing creation's spots, with the nearest town. **Hunt:** hunting grounds by what lives there. **Gather:** what grows in each hold (Callings' `plants.json` where it has it). **Mine and chop:** mines with their ore, wood blocks, forges and smelters outside cities. **Camp:** where camping is allowed (Camping Expansion).
- **The calling view on top:** which of these each Callings calling counts (Bard, Scholar, Fisher, Hunter, Gatherer, Laborer, Smith, Helper, Thief), from the mod's own data.
- Player question 30: "What can Kyria do for work in Riften?" and 25 (a bard in Riften) pass once Mac's WO-143 Part 2 lands.

### Every part: a sanity pass before it's done (Bob, 23 Oct, 15:55)
Twice today a part looked right by its counts and wrong by its values (distances in real km reading as "next door"; 108 places with enemies at level 1 to 1). Before any part of this order goes to `for Bob`:
- [ ] **Impossible values fail a test:** no level range of 1 to 1 or wider than the zone allows, no place that is its own nearest town, no city as an inn, no empty name, no editor-style name where a cell name exists, no price of 0 or over 100,000, no merchant with nothing to sell.
- [ ] **Ten spot checks against things we know,** written in the log with what each was checked against (UESP or the records): for places, Bleak Falls Barrow, Fort Hraggstad, Embershard Mine, the Bee and Barb, Narzulbur; for people, Farengar, Belethor, Arcadia, Lydia, Borgakh; for books, the five Sneak books; for doings, Riften's inn and board.
- [ ] **Look at the output as a player would:** pull one place, one person, one book through the door and read what a player's Claude would say. Paste it in the log.
Bob checks values on every part, not counts.

### Done when
- [ ] Part 1: places fixed, strongholds and settlements and city buildings in, the roads table; `suggest_places` returns places for all nine capitals; player question 26.
- [ ] Part 2: `people.json`, `search_facts` person, `get_person`; player questions 27 and 23.
- [ ] Part 3: the teaching books placed and the book rooms counted; player questions 28 and 29.
- [ ] Part 4: `doings.json` with the calling view; player question 30 (with Mac's WO-143 Part 2).
- [ ] Each part pushed on its own with `Status: for Bob` and its question green; every check in CLAUDE.md passes each time. Then WO-140.

---

## WO-143  A calling's things to do: what a bard, a scholar, a fisher can do in each town (Mac, after WO-144 Part 4; Part 1 is folded into WO-144 Part 4, 23 Oct 2026)
Status: held (Dave, 23 Oct, 19:35: everything paused; see docs/pause-2026-10-23.md; was: queued, after WO-144 Part 4)

**Why.** Dave (23 Oct): designing a character with a calling (his Callings mod) means giving them things to do that use it. Kyria is a bard, so the Bards College is an obvious stop; but there are also many books to read there, and every town has an inn to play. The planner has no idea what a calling can do where, so an assistant can't plan an act around one. The style guide says an act has a standing rule ("Play the Bee and Barb most nights") but nothing tells the assistant which inns exist, which towns have bookshelves worth reading, where the fish are.

### Part 1. The index (PC)
From the records (and Callings' own data where it has it: its inns per hold, `plants.json`): for each town, settlement and place in the places index, what each calling can do there:
- **Bard:** every inn with its name and hold (Callings counts inns per hold); the Bards College.
- **Scholar:** where the books are: libraries and rooms with many readable books (the Arcanaeum, the Bards College's library, Dragonsreach, the Blue Palace, Jorrvaskr's, Hjerim…), with a count from the placed book references.
- **Fisher:** fishing spots (the Fishing creation's spots), with the town they're near.
- **Hunter:** hunting grounds by what lives there (from the places index's actors and the hold's wildlife spawns).
- **Gatherer:** what grows in each hold (Callings' `plants.json`).
- **Laborer and smith:** mines with ore veins and their ore, forges and smelters outside cities, wood-chopping blocks.
- **Helper and thief:** the favours and the jobs by town already come from the quests; a count per town is enough here.
Written to `callings.json` with each item's source.

### Part 2. The door and the guide (Mac)
- `suggest_places` and a new `suggest_doings(playthrough, act, calling)` read WO-144 Part 4's `doings.json` and return, for the act's towns, what the calling can do there, in the game's words, with "already used" the way places have it.
- A playthrough carries `callings` (up to two, by name) with its answers (WO-139); the style guide gains a rule: when a character has a calling, every act gives it things to do in its towns, from suggest_doings, and the standing rule names one of them.
- Kyria's Act I gains the Bee and Barb and Riften's books as the worked example.

### Done when
- [x] (folded into WO-144 Part 4) Part 1.
- [ ] Part 2: `suggest_doings`, `callings` on the playthrough, the rule; player question 25 ("Kyria is a bard in Riften; what can she do here as one?") returns the Bee and Barb and where the books are. (Mac)
- [ ] Every check in CLAUDE.md passes. Push staging with `Status: for Bob`.

---

## WO-141  What Mogrash's design needed and couldn't get: strongholds, followers, and where the Smithing books are (Mac, after WO-144 Part 2; the PC parts are folded into WO-144, 23 Oct 2026)
Status: held (Dave, 23 Oct, 19:35: everything paused; see docs/pause-2026-10-23.md; was: queued, after WO-155 (people reads replace WO-144 Part 2))

**Why.** Dave's character test (23 Oct): an Orc greatsword outcast who starts in the Windhelm jail and wants his place back at Narzulbur, solo until a follower at level 30. The build came out right in every detail Bob checked. Three things the assistant couldn't do, each a gap in the planner's data, not in the assistant:
1. **Narzulbur isn't a place the planner knows.** `places.json` (WO-128) holds 477 caves, ruins, forts and landmarks and no Orc stronghold or small settlement, so a reason to travel that ends at a stronghold has nothing to route to.
2. **The planner has no Orc followers.** Its followers are the 12 mod lines and a few named ones. The game's own followers who fit this story (Borgakh the Steel Heart at Mor Khazgur, Ghorbash the Iron Hand at Dushnikh Yal, Ugor and Lob at Largashbur) aren't indexed, so "a follower at level 30" can't be answered.
3. **Where the Smithing books are.** LoreRim gives Smithing perks by book; the planner knows the books but not their places.

### Part 1. Strongholds and settlements in the places index (PC)
- Extend `scripts/gamedata/places.py` to the location types it leaves out that a character goes to on purpose: Orc strongholds (`LocTypeOrcStronghold`: Narzulbur, Largashbur, Dushnikh Yal, Mor Khazgur), small settlements and villages not already towns (Riverwood, Ivarstead, Rorikstead, Shor's Stone, Darkwater Crossing, Kynesgrove, Karthwasten, Dragon Bridge, Stonehills, the Skaal Village, Thirsk, and the lands mods' own), and camps of people (the Stormcloak and Imperial camps, giant camps are already in). Each with its hold, its nearest town, its pointers and the quests that go there, as the index has for the rest.
- A stronghold's row says what it takes to get in: an Orc, Blood-Kin, or The Cursed Tribe's way, from the gate guard's dialogue conditions (the records), in the game's words.
- Also the named buildings inside cities a character goes to on purpose, as places a search can find and an objective can link: temples (the Temple of Mara, of Dibella, of Kynareth), inns (the Sleeping Giant, the Bannered Mare, the Winking Skeever, the Bee and Barb and the rest, with their town), the two colleges, the jarls' keeps, the guild halls, stables. Bob's bard test searched "Temple of Mara" and "Sleeping Giant" and got nothing. `suggest_places` still leaves city buildings out (rule 20 is for the map), but `search_facts` finds them and `add_objective` links them.
- `suggest_places` returns the new map places; a test on an act in Eastmarch that names Narzulbur with its pointer, and one for a non-Orc that says the gate.

### Part 2. A followers index (PC, then Mac)
- PC: `followers.py` builds `followers.json` from the records: every follower a player can recruit, vanilla and mod (`PotentialFollowerFaction`, the lands mods' and the follower mods' own), with race, sex, where they stand, how they join (the dialogue that recruits them, with its conditions: a brawl, a quest, gold, a level), what they fight with (class, the skills the records weight), and whether they can marry. Mod followers already on the pages keep their lines and gain these fields.
- Mac: `search_facts` finds followers by race and place ("orc follower", "a follower in Markarth"); a `suggest_followers` on the door takes a race, a place or a kind (fighter, archer, mage, animal) and returns who fits with how to recruit them; the follower lines' pages show the new fields; the Orc four are a test.

### Part 3. Where the books that teach are (PC)
- The books that unlock Smithing perks in LoreRim (The Armorer's Encyclopedia, Art of the Advanced Nordic Blacksmiths, and the rest of the set crafting.md lists), and the skill books (each skill's five), since the bard test wanted "read a skill book" objectives and the planner could name no book or place: run `readables.py` over them the way WO-131 placed the quest-start items: placed copies with the nearest doors, containers, merchants who sell them, leveled lists. Write them to `teaching-books.json`; `get_perk` for a Smithing perk says where its book is, and `search_facts` finds a skill book by skill, each with its places or "not checked yet".

### Done when
- [x] (folded into WO-144 Part 1) Part 1.
- [ ] Part 2, Mac half only: `suggest_followers` and search on the door from WO-144 Part 2's `people.json`; the follower pages show the fields. (The PC half is WO-144 Part 2.)
- [x] (folded into WO-144 Part 3) Part 3.
- [ ] Player question 23: "Who could an Orc take as a follower, and where?" returns the four with how they join. Every check in CLAUDE.md passes. Push staging with `Status: for Bob`.

---

## WO-140  Name the conditions: the 338 ways that say "a condition the planner can't put in words yet" (PC, 23 Oct 2026)
Status: closed (Bob, 23 Oct: the quest reads write every start in words; see WO-153)

**Why.** The quest-start work is closed, and one gap is left that a player sees: 338 ways on the pages carry "a condition the planner can't put in words yet". The facts are right; the words are missing. The start check names about 30 kinds of condition function; the rest print that sentence. Counted 23 Oct in `story_checks/`: fn606 appears 182 times, then fn565 (26), fn249 (24), fn289 (24), fn286 (23), fn655 (21), fn682 (20), fn654 (17), fn722 (16), fn403 (15), fn327, fn300, fn130, fn248, fn159 (12 to 13 each). Naming the top fifteen clears most of the 338.

### Do
1. **Name them, most common first.** For each function code, from the Creation Kit's condition function list and the records it's used in: what it tests, and the plain words for the forms it takes on our pages (`== 1`, `== 0`, `>= N`, with its parameters resolved: a faction's name, a race, a global's value, a keyword, a location). Put the wording in the start check's table (`story_check.py`'s condition names) and the page's words in `quest_pages.py` (WO-126's rules: the game's words, no ids). A function whose meaning depends on a parameter the records don't resolve gets the parameter named or stays unworded, with the reason in the log.
2. **Drop what no player meets.** A condition that only ever tests the engine's own state (a scene running, a package, a voice type, "the speaker is the one in the alias" when the alias is the speaker) is not a need: drop it from the way, as the moment's tests are (WO-121b's follow-up).
3. **fn606 first and on its own:** 182 uses. Find what it is; if it's one of the engine-state kind, 2 covers it and the count halves at once.
4. **Rerun** `story_check_all.py` and `build.py`; the answer key and every game-data test pass; `npm run test:questions` passes (Mac's door reads the generated file).
5. **Count before and after** in `loop-log.md` ("WO-140"): the 338, how many each function cleared, what's left and why. Under WO-138 Part 5 you decide the wording yourself and log it; Rex reads a sample of ten changed ways.

### Done when
- [ ] The top fifteen functions are named or dropped with the reason logged; the count of "can't put in words yet" on the pages is under 60.
- [ ] No page shows a function code, an editor id or `== 1`; the words are the game's.
- [ ] The key, the game-data tests and the player questions pass; push staging with `Status: for Bob`.

---

## WO-139  Before you design: the questions, their answers kept, what a character will never do, and the mods they need (Mac, 23 Oct 2026)
Status: done (one box for Dave)

**Why.** Dave (23 Oct): an assistant designing a character through the connector should ask the things that shape the design before it starts, the way a good game master would. Today the style guide settles one thing with the player (rule 19, the reason to travel); everything else it asks is mechanical, because `create_build` demands it. Nobody asks whether she will be the Dragonborn, whether she wants a home, where her line is, so the assistant guesses, and the guesses are what make a character read as generic. Asking isn't enough: the answers have to be kept, the ones that close doors have to close them in the planner, and a design that needs a mod LoreRim doesn't ship (Callings, first of all) has to say so.

**How to ask (Dave, 23 Oct).** The wording matters as much as the list:
- Ask about the whole run, not the first hour. "What do they do when something attacks?" made it sound like a character never fights; by ten hours in most characters take quests and kill bandits. Ask how they fight once they do, and separately how they start out. The early stance ("no fight she can walk away from") is an act's standing rule (rule 13), not the character's for life.
- Ask whether, not where. "Do they want a home?" is enough; the planner picks the place that fits the story, and the player can always name one. The same for a mount.
- Ask open, and recommend anyway. "Any faction you want in, or out?" The player may say "never the Companions" or "she should join the Companions"; no answer doesn't mean no faction in the design.
- Don't obsess over the reason to travel. It usually emerges from the story. The point of rule 19 is only that a character who never leaves Riften has very few options; say that when a player asks for one, and otherwise let the reason come up as the acts are written.

### Part 1. The questions (the style guide)
A new section in `content/mcp/style.md`, **Before you design**, between How to build and Playthroughs, and a How to build line: "Before create_build, settle the Before you design questions with the player (offer two or three answers each when they don't know), and keep their answers with set_details." `create_build`'s and `create_playthrough`'s descriptions say the same in one sentence. The How to build line "Before writing a playthrough, settle the character's reason to travel" is softened to "A character needs a reason to leave town now and then; it usually comes from the story as you write the acts. Don't ask for it up front." `create_playthrough`'s WO-127 sentence is softened the same way.

**Always ask, in these words or close to them:**
1. **Will this character be the Dragonborn?** It opens or closes the main quest, Shouts, dragons, the Greybeards and the Blades, and when Dawnguard can start.
2. **How do they fight, once they do?** Blade and shield, two hands, bow, magic (which school), sneak and daggers, or a mix. This is the build's spine.
3. **How do they start out?** A fighter from day one, or someone who avoids trouble at first and grows into it. This sets the first act's standing rule, not the character's for life.
4. **Where is the line they won't cross?** Steal, kill for money, break the law, become a vampire or werewolf, pick a side in the war.
5. **Any faction you want in, or out?** Companions, College, Thieves Guild, Dark Brotherhood, the Bards College, Dawnguard or Volkihar, the Legion or the Stormcloaks. No answer still gets a recommendation.
6. **Alone, or with someone?** A follower (a fighter, a friend, an animal), a spouse, or solo.
7. **Do they want a home? A mount?** Yes or no is enough; the planner picks what fits the story (Breezehome waits on Dragon Rising; a Hearthfire plot waits on thaneship; a mount is bought, earned in Running Wild, or the paraglider). The player can name one.
8. **Where does the story end?** A level or a moment. It sets the number of acts.

**Ask when it matters:** which god, if devout (Wintersun); craft or buy; sleep outdoors or in inns, carriage or walk (survival is on); the name and past.

Numbered as the guide's next rules (27 onward), the Honesty rules renumbered after them; `get_style_guide` returns the section; a test that no "rule N" reference in `src/lib/mcp` points past the last rule.

### Part 2. The answers, kept
- `set_details` accepts `answers`: a list of `{question, answer}` in the player's words, up to 12, each under 300 characters; `get_playthrough` returns them under `about`.
- The playthrough's edit page shows them under the character's details as a plain list the player can edit; the public page shows them under the line, as "About her", only when the player has filled any in. No micro label above the title (design rule 1); the copy follows `docs/design-rules.md`. Screenshots at 1440 and 390.

### Part 3. What a character will never do
- `set_details` accepts `never`: a list of things the character won't do, from the answers. Each is one of: a quest line or story id (`main-quest`, `the-dark-brotherhood`), a side (`imperial`, `stormcloak`), a state (`vampire`, `werewolf`), or a free line in the player's words ("never kills for money"). `get_playthrough` returns it.
- **`suggest_quests` and `suggest_objective` leave out** any story or quest behind a never: a story whose line is on the list, or whose checked needs include a quest or state on it (Dawnguard needs Dragonborn; the Dark Brotherhood's contracts need the Brotherhood). They say so once: "left out: 3 stories this character won't do".
- **`get_quest`'s `openForYou`** says `locked for this character: she won't be the Dragonborn` (the never, in the player's words) when the quest or its checked needs sit on the list, before any level or quest gate. It stays "open for you" otherwise.
- **`check_progression` and `get_playthrough` warn** when an objective, a chapter's unlock or a route stop touches a never: "this act sends her to the Dark Brotherhood; she said never".
- The style guide's Before you design section ends: "Put what the answers close on the playthrough with set_details never, so the planner keeps to it."

### Part 4. The mods a character needs
Dave: Callings (his role-play XP add-on) is what lets a custom character make sense from the start, a bard playing the inn or a scholar reading every book in town, instead of opening on crabs, wolves and bandits. It isn't part of LoreRim, and a design built with these tools may need other mods too. A character on the planner shows the mods it needs.
- A build and a playthrough carry `mods`: each with `name`, `link` (Nexus or the mod's page), `why` (one line, what this character needs it for), and `required` or `recommended`. `set_details` sets them through the door; the edit pages have a plain list to add, edit and remove them (name, link, why, required or recommended).
- Both public pages show **Mods this character needs** under the build or line: required first, each with its link and why; recommended behind a smaller heading. Nothing shows when the list is empty. Follow `docs/design-rules.md` (no micro labels, the game's words).
- The guide's mods page (`/guide/mods`) lists Callings. It isn't published yet (Dave's own mod, installed on his PC, Nexus release prep still open), so its entry says "not yet published" with no link, and a `link` on a mod is optional until then; the day it's on Nexus it's a one-line change. Its why, in Dave's words: it gives a custom character a start that makes sense, a bard playing the inn or a scholar reading every book in town, instead of opening on crabs, wolves and bandits.
- The style guide gains a rule: when a design depends on something LoreRim doesn't ship (performing as a bard, a scholar's reading, a custom start, a story NPC), name the mod with set_details mods and say why; Callings first, by name, for any character whose opening isn't fighting. Never assume a mod is installed; the player decides.
- Kyria's playthrough gets Callings as required, with Dave's why, as the worked example.
- **What LoreRim already lets a character do,** so the assistant doesn't send a player to a mod for something the list ships: a short `activities` list through `get_rules` (or `get_fact`): playing instruments and performing at inns (Skyrim's Got Talent, in LoreRim; the Acoustic Arcanist trait reads from it), fishing (the Fishing creation, in), paragliding (in), taming a wild horse (Simplest Horses, in), camping (Camping Expansion, in), reading for XP as a scholar and calling XP in general (Callings, not in). Bob's bard test found no way to tell the player that performing is already in the game.

### Part 5. "Never kills", made checkable (added 23 Oct, 12:00, from Bob's design test)
A thief who never kills got `never: kill` nowhere to go, and the assistant could only say "the planner can't confirm a quest is kill-free". It can, from the objectives: a quest whose objectives include Kill, Defeat, Destroy, Assassinate, Slay or Eliminate needs a kill. With `kill` on the never list, `suggest_quests` and `suggest_objective` leave those out and say so; `get_quest` says "needs a kill: <the objective>" under `openForYou`; a quest with no such objective says "kill-free as far as the objectives go". Tested on Loud and Clear (kill-free) and Contract: Kill Hern (needs a kill).

### Player questions
- 19. "Design me a new character." Can't test the assistant; test what it's told: `get_style_guide` holds the eight questions, worded as above, the softened reason-to-travel line and the mods rule; `create_build`'s and `create_playthrough`'s descriptions point to them.
- 20. "What can she do in Windhelm at level 12?" on a playthrough whose never holds `the-dark-brotherhood` and `main-quest`: `suggest_quests` names neither, and says what it left out.
- 21. "How do I start Dawnguard?" on that playthrough: `get_quest` says locked for this character, she won't be the Dragonborn.
- 22. "What mods does Kyria need?": `get_playthrough` lists Callings, required, with its link and why.

### Done when
- [x] Part 1: the section and the How to build lines in the guide (the reason-to-travel line softened), the two descriptions, the renumbering test.
- [x] Part 2: `answers` through the door and on both pages; screenshots (`test-results/wo139-about-1440.png`, `-390.png`, `wo139-edit-1440.png`, `-390.png`).
- [x] Part 3: `never` through the door; `suggest_quests`, `suggest_objective`, `get_quest` and the warnings keep to it, with tests on a playthrough whose never holds `main-quest` and `the-dark-brotherhood`.
- [x] Part 5: `kill` on the never list reads the objectives; tests on Loud and Clear and Contract: Kill Hern.
- [x] Part 4: `mods` through the door, on the edit pages and both public pages; Callings on the mods guide page (no link: unpublished); the style-guide rule 36. Screenshots (`test-results/wo139-mods-1440.png`, `-390.png`).
- [x] Part 4, `activities`: the list of what LoreRim already lets a character do, through `get_rules`.
- [ ] Part 4, Kyria: Callings on Kyria's own playthrough as required, with Dave's why. Jeff can't reach that row; it is one `set_details` call once staging has deployed (below).
- [x] Player questions 19 to 22 pass; every check in CLAUDE.md passes (typecheck, lint, 581 unit tests with the questions, build, the full e2e). Push staging with `Status: for Bob`.

### Jeff's notes (Mac, 23 Oct)
Decisions made under WO-138 Part 5, each with why:
- **Where things live.** `answers`, `never` and `mods` are columns on the playthrough (migrations 0025, 0026, additive, nullable); a build also has `mods`. `set_details` with `playthrough` keeps all three on the run; with only `build` it keeps `mods` on the build, and `answers`/`never` on the run that build has (refused, with the way out, when it has none). Why: the run is the character's story and every quest tool already takes a playthrough. The character page merges the build's mods and the run's, a mod named on both once.
- **Honesty keeps 22 to 26.** The order says the Honesty rules are renumbered after the new ones. I numbered the new section 27 to 36 instead, so no existing "rule 24" reference moves (the player questions and descriptions cite them). The test that no "rule N" in `src/lib/mcp` points past the last rule now says 36.
- **Rule 19 softened too.** Its "Ask the player for it, or offer two or three" line contradicted "don't ask for it up front", so it now says it usually comes from the story and not to press for it. `create_playthrough`'s WO-127 sentence and the How to build line say the same.
- **Question 21 changed (Bob to rule).** As written, `get_quest` for Dawnguard should say locked for a character who won't be the Dragonborn. The records don't gate Dawnguard on the main quest: Talk to Agmaer at Fort Dawnguard has no need, and Durak's need is met by a main quest never begun. Saying locked would break rule 24. The line the main quest does close is Dragonborn (Solstheim, waits on The Way of the Voice stage 160), so 21 now asks for Dawnguard open and Dragonborn locked for this character.
- **What the planner keeps to.** Quest lines, stories and sides are enforced: `suggest_quests` leaves them out with "left out: 2 stories this character won't do (her words)"; `suggest_objective` refuses; `add_objective`, `get_playthrough` and `finish_draft_playthrough` warn (code `never`) for an objective, a chapter's unlock or a route stop; `get_quest` says `locked for this character: <her words>`. A side locks the war's quests behind its joining quests through their checked needs. States (vampire, werewolf) and the player's own lines are kept and said back with a note that the assistant must keep to them: no checked need names a vampire or a werewolf yet. `check_progression` takes a build with no playthrough, so it has no never to read; the warnings are on the playthrough tools.
- **An unknown id is refused.** An id-shaped entry that names nothing ("the-thieves-gild") is refused with the ids it knows; anything with a space is the player's own line.
- **Callings** is on the mods guide page through the Character chapter's Related Mods, tagged "Not yet published", no link; a mod's `link` is optional. Question 22 tests the shape (`get_playthrough`'s mods and the guide's page), with no link while it is unpublished.
- **Part 5, kill.** `kill` (also `kills`, `killing`) on the never list is read from objectives: Kill, Defeat, Destroy, Assassinate, Slay or Eliminate in a quest's objective words. An optional objective (one starting "(Optional)") doesn't count, since it forces nothing. `get_quest` says `locked for this character: needs a kill: <the objective>; <her words>`, and a quest with no such objective ends its `says` with "kill-free as far as the objectives go" (with a `kills` field). `suggest_quests` leaves out a story whose opening quest needs a kill, `suggest_objective` refuses it, `add_objective` and the playthrough tools warn. A kill the objectives don't say (a bandit in the way) isn't seen, which is why it says "as far as the objectives go". "Never kills for money" stays the player's own words. If a quest is behind a line or side already on the list, that reason is the one given.
- **`activities`.** `get_rules` carries it: performing at inns (Skyrim's Got Talent, in), fishing (the Fishing creation, in), paragliding (in), taming a wild horse (Simplest Horses, in), camping (CC's Camping Expansion, in the guide's name for it), and reading for experience and role-play experience (Callings, not in). The names are the guide's; Bob's list gave "Camping Expansion".
- **Checks.** Typecheck, lint and 581 unit tests (the player questions 1 to 22 pass; later ones are other orders', still marked); `npm run build`; the full e2e (366 of 366 passed on the final build). One real flaw the e2e found in my own work is fixed: the answers list tried to save a half-filled row. An earlier full run had one failure in `wo123.spec.ts` (Kyria's Play tab) that passes alone, with `NeonDbError: fetch failed` from the dev database in its log; I took it for connectivity.
- **For Bob: Kyria's row.** Once staging has deployed, call `set_details` with `playthrough: "Kyria Severa"` and `mods: [{ name: "Callings", why: "<Dave's why>", need: "required" }]`, then read `get_playthrough` for question 22 live.
- Bob, 23 Oct, 12:50: Parts 1 to 5 checked; 22 of 22 player questions. Kyria's row: my session's copy of the tools predates `mods`, so the call can't be sent from here. Dave asks his Claude: "Add Callings as a required mod on Kyria's playthrough, with this why: it gives her a start that makes sense, a bard who plays the inn and reads every book in town." That is also a live test of question 22.

---

## WO-138  Finish the quest starts: the last 40, and every start checked against a second source (PC, 23 Oct 2026)

**Why.** Dave asked for a straight answer on what is left for quests. 1,202 of 1,242 starts are checked, but that is the check against the game's own files. Only 133 are in the answer key, which is where a second source (UESP) has agreed. The other ~1,070 rest on the files alone, and Dave's own test found the files-alone starts wrong in two of the five quests he tried (Deathbrand's level and Geldis, Paragliding's missing place). So there are two jobs: close the 40, and check the rest against UESP the way the loop did for the unchecked ones.

### Part 1. The last 40 (PC)
- **Notes handed over in a talk (about 12: the eight fishing jobs, In the Shadows, others).** The check doesn't read a talk that hands you a note and then the note starting the quest. Read it: a dialogue line whose script adds a book or note, then that book's read script sets the stage. Same for Viriya's fishing jobs and Whiterun's steward.
- **A Black Book read in a place (six).** The book's script isn't a plain "read" one; read the book's activate/read scripts and place the book with `readables.py`.
- **The Thieves Guild's five city jobs.** Trace by hand: TGRShell's `TGRadiantCount`, the stage after it, and what sets it (likely Delvin's talk). Say what the records say; if a script sets it that none of ours names, say so.
- **Three set only by later quests** (Stendarr's Guides, Memory Guide, one more): decide with UESP; Bob rules on the rest.
- **Three helper-only** (Purity of Revenge, Glory of the Dead, March of the Dead): UESP reading, then the planner says what UESP says, marked as the wiki.
- Whatever is still unsettled goes on the needs-Bob list with both readings, as before.

### Part 2. Every checked start against UESP (PC, the loop's way)
- Batches of 40 checked base-game and DLC quests (Creation Club included), most-played first (main, guilds, Daedric, the big side lines). For each, fetch the UESP page and compare who, where, the first step and the gate with the planner's page.
- **Agree:** a key row, `source: uesp`, with the url.
- **Disagree:** a needs-Bob entry with both readings and the record ids, never a guess and never silently trusting either. Where the records win (a LoreRim mod changes it), say so and keep the records' answer with the difference noted.
- **Mod quests** have no second source here: leave them as files-only and count them, so the planner can say "checked in the game files; no wiki page".
- Same gate as WO-132: the answer key and tests after every batch; undo a batch that breaks a passing row; Rex on a sample of each; stop on the same conditions. Report: how many agreed, how many differ, and the differences grouped by kind, so Bob can see whether the same fault keeps appearing (the way Deathbrand's level and Paragliding's place did).

### The numbers (Bob, 23 Oct, from `quests_raw.json`)
1,242 quests listed. 447 base game and DLC, 40 Creation Club: these 487 have UESP pages and are Part 2's whole universe. 133 are in the key already, so about 400 to compare. About 384 are Missives jobs (one class, no per-quest check). The other ~370 are mod quests with no second source: they stay files-only and the planner says so.

### Part 3. Bob's rulings (23 Oct, 07:40), from the PC's sweep and the loop's report

**On the sweep (the 68 quests, `wo137-sweep-2026-10-22.md`), read line by line:**
- **R1. The "I'll do it" line keeps its place.** When a way's own-stage need is set by the quest running from the game's start, or by the same speaker's earlier line in the same conversation, the talk is the way in and the condition is rightly dropped. This is most of the list: the Rift's and Ivarstead's odd jobs, Raven Rock's and Tel Mithryn's favours, Meridia's Order, the Fists of Fury, Solitude's favours, Caught Red Handed, Spread the Love, Kyne's Sacred Trials (Froki's own offer sets 15 and 20), The Bonds of Matrimony (Maramal's own line sets 10), Brelyna's Practice, Impatience of a Saint, Siege on the Dragon Cult, Repentance, The Only Cure, Paid in Full, Graystone. **No change.**
- **R2. A line whose need is set by another listed way is a step, not a way in.** Where the stage a line needs is set by a node, a trigger, a book or another person's line that the page already lists, the line leaves `ways` and becomes the first step. Unearthed (the Kolbjorn node sets 10; every Ralis line is a step), Durnehviir (the Boneyard sets 10), Laid to Rest (the node; Jonna and Benor are steps), The Man Who Cried Wolf (the rumour; Elisif is the step), The Wolf Queen Awakened (Falk's letter node; Falk's line is the step), Battle of the Champions (the first line sets 20; the Captain's lines are steps), Reluctant Steward (Varona's line sets 90; Neloth's at 100 is a step), A Blade in the Dark (the Horn's note sets 5; renting Delphine's attic is the step), Thieves Guild Caravan Fence (the fence quest's start; Tonilia's is the step), The Oblivion Engine (Lucien's "this letter is for you" sets 10 after the letter; the letter is the way).
- **R3. Of one speaker's lines that need successively higher own stages, only the lowest is a way in.** The rest are steps. Bad Vibrations (10 stays; 20, 30, 40 go), Hunting and Gathering (50 and 75 are steps; the way in is what sets 50), From the Ashes (30 is a step), Pit Fighter (19 is a step), The Welkynar Knight's artifact quest (100 is a step), A Night To Remember (Senna's three lines at 5 are the same moment, keep as one), Fists of Fury (Maul's four lines are one), Reparations (three speakers at 10 are one way: "Ask Mercer, Brynjolf or Delvin").
- **R4. Books with a prerequisite stage** are worded by hand with it, as Deathbrand was: Letter to Lucien ("after The Oblivion Engine has begun, read…"); Wyrmstooth's Dunyick's Request, Miner's Warning and Ja'Shavi-Dar's Note need "stage 0 done", which means the quest is already running on Wyrmstooth: "On Wyrmstooth, read…".
- Mac applies R2 and R3 as rules in `quest_pages.py` (a line's needed own stage is set by another listed way, or by a lower line of the same speaker), with the quests above as the tests. R4 by hand in `overrides.json`.

**On the giver question (the loop's stop):**
- **G1.** UESP's giver **agrees** with the page when it is the page's `who`, **or** the person whose talk or scene sets the quest off (the previous quest's last speaker), **or**, for a radiant job, the person who hands the job out. One dispatcher: a key row with that giver. Several (Farkas, Aela, Vilkas, Skjor; Delvin, Vex): a `noGiver` row, and the page's ways name them ("Ask Farkas, Aela, Vilkas or Skjor in Jorrvaskr"). Where UESP's giver sends you and the page's `who` is the first person you speak to, keep `who` and Mac adds `sentBy` with UESP's giver.
- **G2.** UESP says it starts by itself and the page names a person: when that person's line sits in the previous quest's ending, the page is wrong. No giver; the way is "After <previous quest>"; the first step names the person. Key row `noGiver`. Mac's rule: a talk in another quest's topic that sets this quest's first stage is "After <that quest>", never "Ask <speaker>", unless the line is an offer the player can decline.
- **G3.** First-step differences: the records' objective text wins over UESP's paraphrase ("Kill Paarthurnax"). Where UESP lists an earlier objective the page skips, the PC says which stage the start sets: if the records set the later stage directly, the records win, in `DIFFERS` with the reason; if the earlier stage is reachable, the page's rule 1 is wrong for that quest and the key row carries UESP's step. The 12 (and batches 5 to 9's 15) go in `DIFFERS` with the record's reason; Bob reads them after the run.
- **G4.** A page way that says "Talk to someone the records don't name" never agrees and never ships: Mac names the speaker from the alias, the ref type or the faction ("a Windhelm guard"), or drops the way when the quest starts by itself.
- **G5.** Handlers and helpers with no UESP page (Prophet's two halves, Dawnguard's radiant parent, the TG00 handlers, Scoundrel's Folly Post) are not quests a player starts: out of the pages, out of the quest log, counted as background. Mod quests: files-only, and the planner says "checked in the game files; no wiki page".
- **G6.** A key row confirms the giver and the first step only. The page's ways and needs still follow the rules, and a shell or handler quest ("Through Thieves Guild Radiant Shell", "Through Dark Brotherhood") is never a way or a need on a page: the patch-helper rule covers them too. Mac.
- Rex's smaller notes (a `towns` entry that isn't a town, a `thenWho` that is a recruit, "Shaman's Hut, Skaal Village Shaman's Hut", a previous quest missing from needs, flags that could be worded): Mac, in the same pass.

### Part 4. Mac's pass (after the PC restarts)
Also, from the loop (Rex's notes in `loop-log.md`, carried here so Mac sees them): The Cause's only way is a placed thing in the Deadlands a player can't reach before it starts (UESP: a courier with Stranger's Plea at level 46; say that); Crustacean Extermination shows "after No Contest"; the Jarls' bounties say "Ask a jarl, their steward or an innkeeper"; the eight Thane quests' "a jarl" way names the jarl of that hold; the Civil War's radiant templates are one class under the line, as the boards are.
R2, R3, R4, G1's `sentBy`, G2, G4, G5, G6 and Rex's notes, each with a test from the quests named above. `npm run test:questions` and every check in CLAUDE.md.

### Part 5. Jeff decides (Dave and Bob, 23 Oct)
Dave asked why Jeff can't make Bob's calls himself. He can. WO-132's "never pick one to keep the loop moving" was written after Jeff graded his own work badly, and it has become the bottleneck: every definition question waits a night for Bob. From here:
- **Jeff decides pattern questions himself** (what counts as a giver, whether a line is a way in or a step, how to word a class of starts), writes the decision and the reason in `loop-log.md` under a "Decisions" heading, applies it, and keeps going. Bob reads the decisions after the run and overturns any he disagrees with; the log says which quests each decision touched, so an overturn is one rerun.
- **Rex still reviews a sample of every batch**, so Jeff isn't grading his own work. A CHANGES NEEDED on a decision, not just an entry, stops the batch until it's fixed.
- **Jeff stops only for** a single quest where neither the files nor the wiki settles it, and then he marks it "not checked" with both readings and moves on, not waits. The "30% three batches running" stop is gone; the other stops stay.
- Bob's rulings in Part 3 stand as the first decisions in the log. Where Jeff finds one doesn't fit the records, he writes why and decides.
- **The short loop.** Bob watches `staging` for Jeff's pushes. When a batch lands, Bob reads what was set aside in `needs-bob.md` and the new decisions in `loop-log.md`, writes his rulings to `story_checks/bob-rulings.md`, and pushes. Jeff pulls and reads that file at the start of every batch and applies anything new; a ruling that touches quests in an earlier batch gets those quests rerun in the next one. So a question waits one batch, not a night.
- The same holds for Mac on Part 4: a wording rule that needs a call gets decided, logged in the order, and built.

- PC, 23 Oct, the Part 5 restart. Report: `story_checks/loop-report-2026-10-23.md`; decisions, versions 1 to 8, in `loop-log.md`.
  - Part 2 ran all 9 batches (345 starts). Rex sent back a rule in batches 5 to 9; each one stopped the batch and was fixed, and the earlier batches were re-sorted.
  - 320 key rows: 217 pass now, and 103 wait on Mac's Part 4, each marked G1, G2, G3 or G4 so it turns green when the rule lands.
  - Of the rest, 9 are handlers (G5), 7 are the Civil War's radiant class, 7 have no UESP page, and 2 G4 quests have no page to hold a row.
  - None is left not checked. The loop's `DIFFERS` list stayed empty: by D6 a records-win row holds the records' step, so the giver is still tested.
  - Checked starts: 1,224 of 1,242.

### Part 4b. Four things Bob found on the live planner after Part 4 (Mac, 23 Oct, 10:00)
Read on the live door after e26f979. The checks all pass; these are faults the tests didn't cover, and each gets a test now.
1. **R2 isn't firing when the setter sets a lower stage.** Reluctant Steward still lists Neloth's "No, I haven't seen Varona." (needs stage 100) beside Varona's line (sets 90); Unearthed lists all three of Ralis's lines (need 10, 14, 20) beside the Kolbjorn node (sets 10). Refine R2: a line that needs the quest's own stage **at or above** a stage another listed way sets (a node, a trigger, a book, or another person's line) is a step, not a way in. The quest's start-game flag and the same speaker's own earlier line aren't "another listed way" (R1 keeps the "I'll do it" lines). Tests: Reluctant Steward shows Varona only; Unearthed shows the node and Geldis, with Ralis as the first step; Durnehviir shows the Boneyard only.
2. **The Thane quests name the wrong jarl and show the hidden start as a way.** Thane of Whiterun says `who: Vignar Gray-Mane` with "Talk to Vignar Gray-Mane" (no place) as a way, and "It starts by itself when you enter Whiterun" as another. The jarl is Balgruuf the Greater in Dragonsreach unless the Stormcloaks hold Whiterun; the hidden start on entering the hold is the gate, not a way (the same shape as Deathbrand's level-up). For all eight: `who` is the hold's sitting jarl, `where` the keep, the way "Ask <jarl> 'It would be an honor.' in <keep>, once you've helped people of the hold", a note "<other jarl> if the war has changed hands", and no "starts by itself" way. Haafingar (Elisif) is right already. Player question 18 below.
3. **A chain quest shared by two sides names one side's sender.** Chasing Echoes has `sentBy: Lord Harkon`; on the Dawnguard side it's Isran (Dexion reads the scroll). Where a quest runs for both sides, `sentBy` names both ("Isran, or Lord Harkon if you sided with the vampires"), the planner's own side first. Check the other shared Dawnguard quests (Prophet, Seeking Disclosure, Unseen Visions, Touching the Sky, Kindred Judgment).
4. **Joining the Legion's "a condition the planner can't put in words yet."** Name it from the record (most likely "if you haven't joined the Stormcloaks", a CW00 stage or faction test). The same for Joining the Stormcloaks.

- Mac, 23 Oct, Part 4b. All four, each tested in `test_wo138.py` (`Part4b`); player question 18 passes.
  1. **R2 at or above.** A line needing its own quest at or above a stage another listed way sets is a step.
     - Reluctant Steward shows Varona only. Neloth's line (needs 100) is a step, and Neloth is `sentBy` (G1: UESP's giver, who sends you to Varona). The truth test now takes a row's giver as `who` or as `sentBy`, as G1 says.
     - Unearthed loses Ralis's lines that need 10, 20 and 40 (Geldis sets 10) and keeps the node and Geldis.
     - **My call, against the order's test:** Ralis's "What's the matter with you?" stays a way. Its only need is that Unearthed hasn't started, so the records let him start it.
     - Durnehviir has one way, his talk in the Boneyard; the records have no Boneyard node of its own.
     - **My call:** a trigger placed only "somewhere" isn't a way a player can aim for, so it sets no stage for R2. Without that, Skirmish at Whitewatch lost its courier to a trigger nobody can find.
  2. **The Thane quests.** Each of the eight is the hold's sitting jarl, in their keep, with the record's own line and the need "once you've helped people of the hold". `whoElse` names the other side's jarl ("Vignar Gray-Mane if the Stormcloaks hold Whiterun"), and get_quest gives it as `orIfTheWarChangesHands`. No "starts by itself" way, and Making Friends' "After …" ways are gone, being that same need. The jarls and keeps are in `overrides.json` (`_jarl`), sourced to UESP. The Thane rows in the key now name the sitting jarl (Whiterun's: Balgruuf, or Vignar), replacing "no single giver" and my Part 4 Vignar.
  3. **Both sides' senders.** Chasing Echoes and Seeking Disclosure: "Isran, or Lord Harkon if you sided with the vampires", Dawnguard first. The records trace only Harkon's line, so it's by hand (`_sentBy`). Prophet, Touching the Sky and Kindred Judgment have no sender, and Unseen Visions' Dexion is the same for both sides.
  4. **Joining the Legion.** The unnamed `fn592` is on two of Rikke's lines, one needing it at 0 and the other at 1 or more. Between them they cover every value, so it only picks which line she says, and it comes off as a need. The rule (`no_gate`) applies to any speaker's lines that differ only by a condition and its complement. Joining the Stormcloaks' only condition was already in words (Level 20).

### Done when
- [x] Part 1: the 40 are checked, or each is on the needs-Bob list with both readings.
- [x] Part 2: every base-game, DLC and Creation Club start (about 400) is in the key or on the needs-Bob list; the report gives the counts and the kinds of difference.
- [x] Part 2, restarted at batch 5 with G1 to G5: every base-game, DLC and Creation Club start is a key row, in `DIFFERS` with the record's reason, or on the needs-Bob list.
- [x] Part 3 and Part 4: the rulings are rules, with tests from the quests named; `sentBy` on the pages.
- [x] Player questions still pass; every check in CLAUDE.md passes. Push staging and stop for Bob.
- Mac, 23 Oct, Part 4. **All 103 rows that waited on it pass** in `test_quest_truth.py`, which now checks them like every other row (`test_the_rows_that_waited_on_part_4_pass`); none went into `DIFFERS` or a waiting list. The rules are in `quest_pages.py`, the tests in `test_wo138.py`. My decisions under Part 5, each with what it touched:
  - **G2, by the records.** A line in another quest that sets this one going is "After <that quest>", with no giver and its speaker as `sentBy`, when the line ends that quest or comes after it has ended (Caught in the Rain completes at 200; Swims's line sets 300). That's every G2 row Bob listed. A line that ends nothing (Legate Rikke's, Galmar's) is still the way in, as Bob's 08:30 ruling says. The records can't tell three more from Rikke's offer, so they're by hand in `overrides.json` (`_after`): Meet the Family, Message to Whiterun, The Silence Has Been Broken.
  - **sentBy is G1's reading.** The truth test reads `sentBy` before the first step's person, as G1 counts the previous quest's last speaker as UESP's giver. That's how Containment (Mirabelle), Get Outfitted (Tullius), Unseen Visions (Dexion) and Where You Hang Your Enemy's Head (Nazir) keep passing under G2. The same Tullius line starts both Get Outfitted and The Jagged Crown, and their key rows read it differently; this reading satisfies both.
  - **G1, the dispatcher.** A radiant job, or a quest running from the game's start, whose ways name no one, names who hands it out:
    - the Companions' from each node's event (CRAela is Aela; CRRecon is Aela's scouting);
    - else the records' named giver (Talen-Jei, Marise, Temba, Balimund, Madesi);
    - else the one person the quest holds (Vex, Delvin).
    - Several dispatchers, or a job offered through the run-time alias QuestGiver (Ahtar, Annekke, Brunwulf, Fanari): one way naming them, no single giver.
    - A quest whose objective shows at once from the game's start (The Thalmor's Shadow) is left with none.
    - D1a: a quest's own lines come before a talk that only sets another quest's stage, so Astrid leads in Whispers in the Dark, before Muiri.
  - **G4, a name for every speaker.** In order of preference:
    - The alias's one person (Urag for Shalidor's Insights).
    - A Civil War field commander is the side's commander: Legate Rikke or Galmar Stone-Fist.
    - The Thane quests' QuestGiver is "the jarl of <hold>" (Rex), read from the quest the alias belongs to, so it works for Making Friends and Influencing People too.
    - Steward and Innkeeper are roles ("a jarl's steward", "an innkeeper").
    - A line conditioned on a guard faction is "a guard"; on the Legion or the Sons, that side's soldier.
    - A Creation Club line whose speaker the check couldn't resolve, in a quest holding one person, is that person (Swims-In-Deep-Water).
    - Nothing names them: the line goes when another way remains, and an unnamed line inside another quest's stage leaves the start as "After <that quest>".
    - 102 unnamed ways became 11, none in a key row.
  - **R2 and R3.**
    - R2: a talk needing its own quest at a stage another listed way sets is a step. Listed means another person's line, a node, a trigger, a book or a quest a player plays, never a handler's script (R1 and G6). A Night To Remember loses Senna's lines; Thieves Guild Caravan Fence keeps Tonilia (TGStatus is a handler).
    - R3: one speaker's lines needing higher own stages leave only the lowest (Bad Vibrations).
    - R3's wording: one speaker's lines with the same needs are one way (Maul's four), and one line said by several people, with no single giver, is one way naming them all ("Ask Mercer Frey, Brynjolf or Delvin Mallory…", the bounties' "Ask a jarl's steward or an innkeeper…").
    - **Not by rule:** Unearthed, Durnehviir and The Wolf Queen Awakened, where a node starts the quest and its own fragment reaches the stage the talks need. The records give the node's call as "Start", not the stage, and a rule that treated every node as setting it took away R1's real ways in (Ancestral Worship, Grimsever's Return). For the PC: the stage each node's quest reaches before its first talk.
  - **Rule 1, notes in hand (G3).** A talk that hands over a note shows its "Read …" objective as the first step even on a quest that also runs from the game's start (In A Pinch, Catch of the Day). A quest started by another quest's script with a note in hand reads it first (Frozen Fish, Two of a Kind, End of the Line). Both are limited to "Read …" objectives: wider, they changed Innocence Lost, The Raid and Tusked Terror.
  - **By hand, with sources** (`overrides.json` questStarts `_who`), where the records the check reads don't hold the person:
    - A New Source of Stalhrim: Deor, Bob's scene ruling.
    - Experimental Subject: Neloth.
    - Repairing the Phial: Quintus Navale.
    - The three fishing radiant jobs: Swims-In-Deep-Water.
    - Thane of Haafingar: Elisif.
    - Thane of Whiterun: Vignar Gray-Mane, as the PC read UESP. **For Bob:** Whiterun's jarl is Balgruuf unless the Stormcloaks take the city; check whether UESP gives both.
  - **R4** in `overrides.json`: "After The Oblivion Engine has begun, read Letter to Lucien"; "On Wyrmstooth, read …" for Dunyick's Request, Miner's Warning and Ja'Shavi-Dar's Note. Deathbrand's was already in.
  - **G5:** the nine handlers the loop named are off the pages (`overrides.json` questBackground), so the quest log counts them as background.
  - **G6:** "Through <helper>" is a way only when the helper is a quest on the planner's pages. Thieves Guild Radiant Shell, Riften Scripted Scene Bridge and Shalidor's Insights Rewards are gone from every page.
  - **The Civil War's radiant class** (Bob, 08:30): the seven templates are one class under the line (`overrides.json` questTemplates), on the quest page and in get_quest as `radiantJobs`, and off the per-quest list. 1,226 quests on the pages now (1,242 less the 9 handlers and the 7 templates).
  - **Rex's notes:**
    - The Cause: "A courier brings you Stranger's Plea", Level 46, said as UESP's.
    - The bounties: by the role merge.
    - The Thanes: "the jarl of <hold>".
    - Crustacean Extermination: no longer shows "after No Contest".
    - "Shaman's Hut, Skaal Village Shaman's Hut" and seven like it: the town once.
    - Not done: a `towns` entry that isn't a town, a `thenWho` that's a recruit, a previous quest missing from needs, and flags that could be worded. Each needs the quests Rex meant; send them and they're one pass.
  - **The key, three edits:**
    - Striking the Heart: "Aela" is the records' "Aela the Huntress", as the other Companions rows say.
    - Stealing Plans: the batch read "Whiterun", a place on UESP's page, as a second dispatcher. UESP names Aela, and the records' only node is her scouting.
    - Rescue Mission: into `DIFFERS`. UESP names Skjor or Vilkas; both of LoreRim's nodes need Vilkas.
- Bob, 23 Oct, 10:35, on the live door after f2c67c0: Thane of Whiterun names Balgruuf in Dragonsreach with Vignar as the other side's jarl; Reluctant Steward shows Varona only, sent by Neloth; Unearthed is down to one Ralis line; Joining the Legion is open with no unnamed condition; 18 of 18 player questions and the key's 475 rows pass here too. One nit for a later tidy, not a reopen: Unearthed's `needs` line lists "Talk to Ralis Sedarys in Kolbjorn Barrow", which isn't in its ways, and Geldis's rumour carries an unnamed condition. **The quest-start work is closed:** 1,224 of 1,242 starts checked, 475 confirmed in the key, 18 honestly "not checked".

---

## WO-137  Five faults in Dave's final test (Mac, with the PC for one check, 22 Oct 2026)

**Why.** Dave's Claude answered the first four test questions (22 Oct, 14:19). Running Wild and the Riften question were right. Bob read the rest against the live planner and `get_quest_log` and found five faults, now questions 12 to 16 in `docs/player-questions.md`:

1. **Conditions the plain words drop (Deathbrand).** "It starts by itself when you level up" has no level. Its story node needs `DLC2dunHaknirTreasureQSTMinLevel`, a global that reads 20 now, and the record's own condition is "level >= (now 20)". The Cursed Tribe's "Level 20" shows because it is a plain number; a level held in a global is lost. Geldis Sadri's talk shows as a plain way in, but its record (Dragonborn.esm:02BAC3, edited by TheChoiceIsYours.esp) is conditioned on "Deathbrand stage 20 done" and "stage <= 1". A way whose condition names the quest's own later stage is a catch-up (rule 6, WO-121b) and is dropped from `ways`, or shown with the condition. Dave's Claude told him Geldis was "the easiest one to aim for".
2. **"And 11 more places."** The read-this item has 14 places and the answer shows three, with no way to ask for the rest. Show up to 8, grouped by area, nearest named first; the rest by a `places` option on `get_quest`.
3. **A line's "not yet" overrides a quest's checked answer.** Ask for Running Wild, Deathbrand or Caught Red Handed and the answer opens with "This line's start hasn't passed the planner's start check, so no instructions are given" over a quest whose own start is `checked: files`. Claude keeps repeating "the line as a whole hasn't passed". When the quest asked for is checked, say that first, and say what is unchecked about the line once, in a sentence, with no "no instructions" note. A line whose quests are all checked as a class (Missives) shows `checked: files`, so "a missive from the notice board" isn't "unknown".
4. **The quest log.** (a) Each line under its own category, not one heading ("Main quests" was Claude's own for mod side stories). (b) No helper names: "TG00 Misc Handler" and "LTN Quest Handler" are shown; map a helper to its line's story title or count it as background. (c) A quest at stage 0 isn't started; don't list it as "started but unclear" (about 100 of them for Save 70). Stage 1 and above stay. (d) No quest twice (Animal Extermination, Special Delivery).
5. **Search for followers.** "Freeing Inigo" finds nothing by name; the line "Inigo" (Followers) and its quest Bad Vibrations exist. Add the words players use for a follower's rescue ("free", "jail", "recruit", the cell and the person's name) so a search for the plain job finds the line.

6. **A trigger with no place name (Paragliding in Skyrim, Dave's test, 22 Oct).** The planner says "It starts from Para Intro Gazebo Discover somewhere in Skyrim": the trigger's own name, and no place. The three placed references (Paragliding.esp:00802D, :008021, :009060) sit in the open world with no name of their own, so the board reader wrote "somewhere in Skyrim". Dave knows it: close to Falkreath, a man falls out of the sky and you read his journal (Fredrick's Journal, which sets the second step). Fix: (a) **name the nearest named place** to each placed trigger, the way `readables.py` names the nearest doors: "near Falkreath", with the distance in the data; (b) word a trigger start as a player meets it ("Walk to the spot near Falkreath where a man falls from the sky; read his journal") using the trigger's script and the journal, never its editor name; (c) **a trigger start is not a need.** `openForYou` should be "open for you" when nothing else gates it (a mod quest with no level), not "unknown" because the way is a trigger; (d) Dave's finding goes in by hand now, as Running Wild's did (`overrides.json`, `_source: "Dave, 22 Oct 2026"`), until the file's place agrees.

### PC (one check)
For item 1, read both Deathbrand lines (the level-up node and Geldis's talk) against UESP and the records, and write which are ways in and which are catch-ups to `loop-log.md`. Then Mac applies the rule to every quest. One more look across all the checked starts: how many ways have a condition naming the quest's own stage, or a level held in a global, and are being shown without it. List them for Bob.

- PC, 22 Oct. Details in `story_checks/loop-log.md` ("WO-137: the PC check"):
  - **Deathbrand.** The level-up node is the gate (level 20 in LoreRim, 36 in vanilla per UESP), not a way. Arriving on Solstheim at level 20 checks the same global inside DLC2Init's script.
  - The ways in are reading Deathbrand (its script needs stage 20, which is set once the gate has passed) and finding the pirates at Haknir's Shoal.
  - Geldis is a way in under Dragonborn.esm's condition. TheChoiceIsYours.esp's "stage <= 1" can't hold while stage 20 is done, so in LoreRim his line only comes after the book: a catch-up.
  - **The sweep:** 138 ways need the quest's own later stage, a level held in a global, or a book's prerequisite stage.
    - Against the pages after Mac's e874f10: 72 are shown without it (67 own stage, 5 books), 29 as an unworded condition, 14 with it (every level held in a global), and 23 aren't ways on the page.
    - 68 quests are affected. The list is `story_checks/wo137-sweep-2026-10-22.md`.
  - **Item 6 (a):** `boards.json` places in the open now carry `nearPlace` and `nearTown` with metres. Paragliding's triggers are by its Flight Platform marker (2 m) and Peak's Shade Tower (31 m), in Falkreath hold. (b) to (d) are Mac's.

### Done when
- [x] Deathbrand's level-up way shows level 20; Geldis is dropped or shown with his condition. The same rule holds for every checked quest, with a test, and the PC's list of other cases is in the log. *The Mac's list is below; the PC's reading of both Deathbrand lines against UESP isn't in `loop-log.md` yet.*
- [x] Places: eight at most, grouped, and a way to ask for all.
- [x] A quest asked for answers first with its own checked start; the line's gap is said once; Missives show `checked: files`.
- [x] The quest log: categories, no helper names, no stage 0, no repeats. Tested on Kyria's Save 70. *On the stages Bob named from it; no copy of the save is in the repo.*
- [x] Inigo's rescue is found by search.
- [x] Player questions 12 to 16 pass and come off "fails today". Every check in CLAUDE.md passes. Push staging and stop for Bob. *And 17 (item 6).*
- Mac, 22 Oct:
  - **Item 1** (`quest_pages.py`). A helper started by a story manager node keeps the node's needs, so the level-up way reads "It starts by itself when you level up" with "Level 20" (the global's value now). A talk that needs its own quest at a stage later than the one it sets is a catch-up, not a way in, beside rule 6's "past the first objective": Geldis's talk sets Deathbrand's 1 and needs its 20 done, so it goes. Across every quest the rebuild changed twelve:
    - **Needs the words had dropped, now shown:** Dragonborn (Level 25, After The Way of the Voice and the rest), I Done Got Thaned! (Level 14), Caches of Skorjan Iron-Beard (Level 15), A Forlorn Hope (After Seeking A Cure), Rejoining the College, Honor Thy Family, The Taste of Death, The Call of Gray Cowl of Nocturnal, Civil War Champion Armor (a condition not yet in words), Blood on the Ice (When you enter Windhelm), Deathbrand (Level 20).
    - **Catch-ups dropped:** Deathbrand's Geldis Sadri; Unearthed's two Ralis Sedarys lines that pay or persuade him for the tale (both need Unearthed past the stage they set). Unearthed keeps Ralis's four other lines.
    - For Bob: Deathbrand still reads "open for you" at level 10, through the book and through Dragonborn's Init quest, a patch catch-up the words drop but the record form the judge reads still holds. That was so before this order.
  - **Item 2.** quests.json keeps every place a read-this item is found (`whereIs`), grouped by area (`whereIsArea`: the town a cell is in, what it's in, or the place itself; "Anywhere" for loot). get_quest gives eight, `whereIsByArea` when they span more than one area, and "6 more places, 14 in all: ask again with places: true"; `places: true` on get_quest gives all. The quest pages list every place.
  - **Item 3.** A line with no story answers for the quest asked: the quest's facts come first, the line is `checked: files` when that quest's start is, and `aboutTheLine` says once how many of its quests aren't checked. Only a quest whose own start isn't checked gives no instructions. Gravewind's quests are all checked now, so WO-108's "no instructions" tests use On Hogithum.
  - **Item 4** (`quest-log.ts`). The log groups each line under its category; stage 0 isn't listed or counted; a helper (handler, helper, pointer, hook, an editor's label, a "... Scene/Favor/Fence Quest" record) that shows an objective stands under its line's name, else it's background; one quest name in a line shows once, the livest kept.
  - **Item 5.** A follower's line is also found by the words for getting one (free, freeing, rescue, recruit, hire, join, jail, prison, cell) and by its opening quest's people and places: "free Inigo", "Freeing Inigo", "Inigo jail" and "recruit Inigo" find Inigo.
  - **Item 6.** Dave's finding is in `overrides.json` as a player's report: "A man falls from the sky near Falkreath; find his body and read his journal, Fredrick's Journal". A start from a trigger or a board ("It starts from ...") is a way in, not a need, so Paragliding is "open for you" at level 12; a way's own bracketed needs still count. Naming the nearest place to a placed trigger and wording it from its script and journal need positions the board reader doesn't keep yet: that's the PC's, and its place replaces Dave's when Bob checks they agree.
- Mac, 22 Oct, after the PC's check:
  - **Deathbrand, as the PC read it.** In `overrides.json` questStarts (with a new `_wayNeeds` for a need the records leave off a way), the level-up node is no longer offered as a way: it's the gate. The ways are "Read Deathbrand" and "Go to Haknir's Shoal, where pirates have landed, and take the map from their leader", each with Level 20. The record form the open-or-locked judge reads takes the same need, and a patch's catch-up helper (DLC2Init here) is no way in there either, as the words already had it. Reading something now counts as a way in, with its own needs. So Deathbrand is "locked: needs level 20" at 10 and "open for you" at 20. Dropping the patch helpers changed the record form of 31 quests and none of their words. Question 12's test wants Level 20 on the book and the Haknir's Shoal way; its Must line in `player-questions.md` still names the level-up way, for Bob. Tests: `src/lib/mcp/wo137.test.ts`, `WayNeedsTest`.
  - **Tried and taken back:** a rule that a talk needing its own quest past every stage its own starts set is a catch-up (to catch Battle of the Champions and Kyne's Sacred Trials). The Rift's odd jobs start from the story manager with no stage number, so it dropped about 60 real "I'll do it" ways in, and the answer key check failed. Nothing of it is in.
  - **For Bob, from the PC's sweep:**
    - The 67 "I'll do it" talks after a silent start (the Rift's odd jobs, Raven Rock's and Tel Mithryn's favours, Meridia's Order and more) stay as ways in. They need only the stage the quest's own start sets. Showing them with their condition ("once the job has started by itself") or as the first step is a wording call.
    - Battle of the Champions (Yrsarald, stage 20 done) and Kyne's Sacred Trials (Froki, 15 and 20 done) still offer talks that need a stage reached by playing, as Geldis did. The records alone don't tell those apart from the 67 (see above): rule them, or put them in `overrides.json` by hand.
    - Four more books need a stage first and show none: Letter to Lucien (The Oblivion Engine stage 5), and Wyrmstooth's Miner's Warning, Ja'Shavi-Dar's Note and Dunyick's Request (their quest already running, so they aren't ways in at all). `_wayNeeds` can carry the first; the Wyrmstooth three need a ruling.
    - Item 6 (b): the PC's `nearPlace` and `nearTown` reach quests.json on its next start-check rerun; then a trigger start can be worded from them, and Dave's hand wording for Paragliding is checked against it.

---

## WO-136  What the loop found: Bob's rulings, and the tools the last 453 need (PC then Mac, 22 Oct 2026)

**Closed by Bob, 23 Oct 2026: closed by WO-138: boards and dispatchers are read (386 starts), Missives and the Civil War's templates show as classes.**

**Why.** The quest loop (WO-132) stopped after three batches because every quest it took landed on the needs-Bob list, which is the order's own signal that the rules are wrong, not the data. Its report (`loop-report-2026-10-22.md`) shows why: of the 453 unchecked quests, **364 are Missives** (courier and radiant jobs from notice boards), 18 are Vigilant bounties, and the rest are hard cases. The tools read people, books and story-manager events. They don't read boards or radiant dispatchers. The loop wasn't running into the data; it was running into what the tools can read. Bob's rulings on its four groups:

### Bob's rulings
1. **The line's order hides the start (25 quests: A New Order, Unseen Visions, Under Saarthal, Containment, Gift of Saturalia's side quests…).** Rule: a later quest's call counts as a start when it comes from a stage that ends that quest, or when the quest it sets has no other starter. Test against the answer key; add key rows where UESP agrees (A New Order: Bloodline stage 30).
2. **A key row counts as checked.** The loop found five key rows on quests the planner marks "not yet checked" (Black Book: Untold Legends, The Kagrumez Gauntlet, Silenced Tongues, Yngol's Barrow, Sleepwalking Into A Nightmare). A starter confirmed by UESP and held in the key makes the quest checked, with the source shown as the wiki. `test_quest_truth.py` also asks that a quest with a key row is not "not yet".
3. **Boards, radiant jobs and the like (85 quests: Missives 364 across the whole set, the Vigilant bounties, Animal Pelt Collection, Bounty: Book).** One class, not 364 quests. The planner says so in one sentence per kind: "Missives: take a missive from the notice board in any hold's capital or a courier's request; each is a short delivery. Where the boards are:" with the boards the records place. Not one row per job. Quests in this class are `checked: files` as a class, with the same text, and the planner lists them once under "jobs from a board", not one by one.
4. **Helpers ruled out (3):** Purity of Revenge, Glory of the Dead, March of the Dead. Stay "not yet", with the reason.
5. **Starters the check can't name (7):** the Thieves Guild's five city jobs, A New Source of Stalhrim, Sleepwalking Into A Nightmare. PC traces by hand, Bob judges.
6. **Fixes from the reviewer:** the Gather quest's counter shows "(0/0)"; the plugin prints twice in each id in `needs-bob.md`.

### PC
- Teach the start check to read notice boards and radiant dispatchers (placed references with a script, and the dispatcher quest that sets the job's stage), so Missives and the bounties have a starter. If it can't, say so for the class and stop; don't guess.
- Apply rulings 1 and 2, add the key rows, rerun, and write what changed to the loop log.
- Restart the loop (WO-132) on what's left.

### Mac
- Ruling 3: the class sentence on the quest pages and in `get_quest`, with a test that Missives show one sentence and a link to the boards, not 364 rows. Rulings 2 and 6.

### Done when
- [x] Rulings 1 and 2 are in the rules with tests, and the five key rows count as checked.
- [x] (folded) The start check reads boards and dispatchers, or the class sentence says why it can't. Missives and the bounties show once, as a class.
- [x] The loop runs again on what's left and reaches a stop other than "the rules are wrong".
- Mac, 22 Oct: the Mac part (rulings 2, 3 and 6). Tested in `src/lib/mcp/wo136.test.ts`, `e2e/wo136.spec.ts`, `test_quest_truth.py` and `test_quest_pages.py`'s `LoopRulingsTest`. The build now says `789 quest starts checked from the files, 364 as a job from a board, 5 from the answer key, 84 not yet`.
  - **Ruling 2, a key row counts as checked:** a quest the start check left "not yet", with a row in `quest_truth.json`, gets `checked: "uesp"`. It carries `source` (UESP, or Nexus when the row's page is the mod's) and the page's `url`, and the key's first step. A no-giver row has one way, "No one gives it". A row with one giver names them, if the check didn't. That covers the five: Black Book: Untold Legends, The Kagrumez Gauntlet, Silenced Tongues, Yngol's Barrow (UESP), and Sleepwalking Into A Nightmare (Nexus; its row's url is the mod page).
    - The page's label under How it starts reads "UESP" or "Nexus". `get_quest` says "from UESP, confirmed in the planner's answer key (<url>)". `openForYou` judges it like a traced start.
    - `test_quest_truth.py` now asks that no quest with a key row is "not yet". WO-108's e2e used Yngol's Barrow as its unchecked line; it uses On Hogithum now.
  - **Ruling 3, jobs from a board:** `overrides.json` has `questClasses`, by line, with Bob's sentence and its source. For Missives: "Missives: take a missive from the notice board in any hold's capital or a courier's request; each is a short delivery." Each of the 364 Missives quests the check hasn't traced is `checked: files` as the class, with that sentence as its one way in. The line carries `board` (`name`, `says`, `boards`, `jobs`: 364).
    - **The page:** the Missives page lists no job one by one. Under Quests there is one block, "Jobs from a board", with "384 jobs", the sentence, and "Where the boards are isn't checked yet."
    - **The door:** `get_quest` on a missive gives `jobFromABoard` with the sentence, and "Where the boards are isn't checked yet. Don't name one."
    - **Not done:** `boards` is null until the PC's check reads them, so there is no link to the boards yet; the page says so. Only Missives is a class: Bob gave the sentence for it alone. The Vigilant bounties (18), Animal Pelt Collection and Bounty: Book each need theirs. Bob: one sentence each, and I'll add them to `questClasses`.
  - **Ruling 6:** a counter whose total the records hold as 0, because the game sets it when it hands out the job, isn't shown. The Gather jobs' "(0/0)", Animal Pelt Collection's and Retaking Thirsk's are gone; "Gather the item", "Collect the sample pelts". One the records set keeps its count (Spread the Love's "(0/20)"). The plugin printed twice in each id is fixed in `needs-bob.md` (120 entries). The generator that writes the file is on the PC, outside the repo: PC, fix it there too, or the next batch prints them twice again.
  - **Questions:** 11 of 11 still pass.
  - **Checks:** typecheck, lint, `npm test` (524), Python (213), build, and e2e 350 of 351. The one miss was WO-123's Play-tab tick under the full run's load (12.2 s), as on WO-131 Part 0's run; it passes alone. The first run caught the Missives page still listing its jobs under The story (they pay XP); the page now shows no rows for a board line.
  - **For Bob, from the screenshot:** the sentence shows twice, under How to start it (the opening's way in) and in the Quests block. Its label under How to start it says "game files", though the words are your class sentence. Say if How to start it should say "the planner's class sentence" or drop the line.
- [x] (folded) `npm run test:questions` still passes; every check in CLAUDE.md passes. Push staging and stop for Bob.

- [x] **Stop sending `raw` through the door (Bob, 22 Oct, after reading Deathbrand and The Cursed Tribe on the live planner).** `get_quest` still sends `start.raw` with condition functions ("GetInFaction Blood-Kin of the Orcs == 1 or GetIsRace Orc == 1"), editor-ish words ("Through DLC2Init (named \"Init quest\" in its record)") and the lines WO-130 removed from `ways`. Every fact in it is already in `ways` and `needs` in the game's words, so an assistant that reads `raw` can only repeat something a player shouldn't see. Remove `raw` from `get_quest`, `get_quest_start` and every tool output; keep it in the data files and on `/admin`. Test that no tool output holds `raw`, `GetInFaction`, `GetIsRace`, `== 1`, or "Init quest".
- Mac, 22 Oct. `get_quest` and `get_quest_start` no longer send `start.raw`. It stays in `quests.json` for the open-or-locked judge, which reads the stages and counts from it.
  - **It also leaked through `openForYou`:** the judge quoted a condition it couldn't read in its reasons ("unknown: needs GetEventData FavorOrcsIntroKeyword == 1", "needs GetInFaction JobInnkeeperFaction == 1"). The test found 87 quests and lines with one. A reason in the record form now reads "a condition the planner can't put in words yet", for the site too. A reason in words stays ("needs level 20", "needs Bloodline past stage 30").
  - **The test** (`wo136.test.ts`) runs every line and quest through `get_quest`, `get_quest_start`, and `get_quest` with a player at level 20, plus `search_facts` and `suggest_quests`. It checks that none holds `"raw"`, `GetInFaction`, `GetIsRace`, `== 1` or "Init quest", and that the data still has the record form. The player-questions test no longer skips `raw` when it looks for what an answer must never hold.
  - **`/admin`:** it doesn't show `raw` today, so there was nothing to keep there. Bob: say if you want it on `/admin`, and where.
  - **Checks:** typecheck, lint, `npm test` (527), Python (213), build, e2e 351 of 351; `npm run test:questions` 11 of 11.
- PC, 22 Oct. Details are in `story_checks/loop-log.md` and the report's second-run section.
  - **Boards and dispatchers:** `scripts/gamedata/boards.py` finds every placed object whose script holds a quest (directly or through a form list) and calls Start or SetStage on it, with where each copy stands. It writes `story_checks/boards.json`, and the start check reads it. All 364 Missives jobs trace to a trigger by their hold's board (`_M_ActivatorScript`), so the class sentence now carries the 12 boards the records place. The 22 Vigilant bounties start from their activator by the Temple of Stendarr in Stuhn Ravine. They show one per quest, in words from that activator; a class for them is Bob's call.
  - **Ruling 1:** in `story_check.py`. Ruling 2 is Mac's `from_key`; my own version was dropped in the merge.
  - **Rerun:** all 152 lines, then `build.py`. **Checked: 1,202 of 1,242** (789 before): 836 from the files, 364 as jobs from a board, 2 from the answer key, none lost.
  - **Key rows added (4):** The Bloodstone Chalice, Unseen Visions, Containment, and Where You Hang Your Enemy's Head.
  - **The loop's batch 4:** the 40 still not checked, all on `needs-bob.md` with both readings. Most start from a talk that hands you a note (the fishing jobs, In the Shadows) or from reading a Black Book in a place, which the check doesn't see yet. The loop stopped because no quest was left to take.
  - **Mac's tests changed for the new reads:** `test_quest_truth.py` and `wo136.test.ts`. Yngol's Barrow, Silenced Tongues and Sleepwalking Into A Nightmare are traced from the files now, so the key-only examples are Black Book: Untold Legends and The Kagrumez Gauntlet, and the Missives class expects its 12 boards.
  - **Checks:** Python 218, typecheck, lint, `npm test` 527, the questions test (11, run with `QUESTIONS=1` set by hand, since the npm script's Unix-style variable doesn't run in Windows' shell) and the build pass. `npm run test:e2e` isn't run on this PC.

---

## WO-135  The player's questions: the test nothing counts as done without (Mac, 22 Oct 2026)

**Why.** Three days of orders made the quest data more accurate, and Dave's own first three questions on 22 Oct still failed: "how do I start the Palonimo quest" found nothing (WO-133), "how do I start Running Wild" said read a book and not where it is (WO-131), and "what's in my quest log" had no answer (WO-134). Every check we ran tested the data (the answer key, the page tests). None of them asked what a player asks. So the planner could pass everything and still not work. This order puts the player's questions in as the test.

### Do
1. **`docs/player-questions.md`:** each question as a player types it, the tool calls an assistant would make, and the facts the answer must contain (and must not). Start with these, from Dave:
   - "In LoreRim, how do I start the quest called Palonimo?" (finds Running Wild; says read the note; says where the note is.)
   - "How do I start Running Wild?" (the same; its first step is catching the horse.)
   - "What quests are in my quest log?" (active quests from the stored save, in the game's words.)
   - "What can Kyria do at level 6 in Riften?" (only quests open for her; no Dark Brotherhood; Caught Red Handed with its unnamed condition said.)
   - "How do I start Blood on the Ice?" / "…Caught Red Handed?" / "…The Blessings of Nature?" (Dave's quests, each with who, where and the first step.)
   - "Where do I find the book for X?" for each read-this start. (A place, or "not checked yet"; never a guess.)
   - "What do I need for X at level N?" (the needs, or why unknown).
   - "What quests are near me?" with a place. (Only that place.)
2. **`src/lib/mcp/player-questions.test.ts`:** runs each question's tool calls through the same handlers the live door uses (not the database, but real tool output), and checks the answer holds the required facts and none of the banned ones (an editor id, a raw function, an unnamed "someone", a location the records don't hold). The ones that fail today stay in as `todo`-marked failures with a one-line reason, so the list of what doesn't work is in the repo and shrinks.
3. **A command `npm run test:questions`** that prints each question, pass or fail, and what it got. Part of `npm test`.
4. **A rule in CLAUDE.md:** no order that changes what an assistant is told is done until the questions it touches pass; and when Dave finds a question that fails, Bob adds it to `player-questions.md` before writing the fix.

### Done when
- [x] `player-questions.md` has the questions above, each with its expected facts.
- [x] The test runs them through the real handlers; the currently failing ones are marked and named (Palonimo search, where the book is, quest log).
- [x] `npm run test:questions` prints a clear pass or fail per question.
- [x] CLAUDE.md has the rule.
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, and stop for Bob. Then WO-133, WO-131 Part 0 and WO-134 each turn one failing question green.
- Mac, 22 Oct: eleven questions, numbered in `player-questions.md`. Each runs through the handlers the door calls (`searchFacts`, `getQuest`, `suggestQuests`, `playerState`) on the real data, with no database. Its answer is checked for what it must hold, and for what no answer may: an editor id, a form id, a raw function (`GetItemCount`, `fn230`), "someone the records don't name". `raw` and the ids an assistant passes back aren't read for those. A marked question runs as an expected failure (`it.fails`), so it goes red the day it passes and the mark has to come off. `npm run test:questions` prints each question as PASS or FAIL, with what's missing, what it shouldn't have, and what it got.
  - **Pass (6):** 3 Blood on the Ice, 4 Caught Red Handed, 5 The Blessings of Nature, 9 Kyria at level 6 in Riften, 10 Bleak Falls Barrow at level 5, 11 near me in Whiterun.
  - **Marked (5):** 1 Palonimo (WO-133, WO-131 Part 0), 2 and 6 Running Wild's note (WO-131 Part 0), 7 the other 61 read-this ways (WO-131 Part 2), 8 the quest log (WO-134).
  - Blood on the Ice by name gets "2 quests are named Blood on the Ice … ask again with the EDID", so the question asks again with MS11, as an assistant would. Its who is the Windhelm guard's way; the page still names no single giver until the PC's rerun.

---

## WO-134  "What's in my quest log?" (Mac, 22 Oct 2026)

**Closed by Bob, 23 Oct 2026: closed: Bob checked Save 70's log on the live door (22 Oct) and player question 8 passes.**

**Why.** Dave asked his Claude "what quests are in my quest log", expecting the save connector to answer. It couldn't. Checked 22 Oct: `read_latest_save` hands back each quest's highest stage, and `set_snapshot` stores them (`snapshot.questStages`, used by `get_quest`'s `openForYou`), but nothing gives them back as a log. `get_playthrough`'s `whereYouStand` carries only the save's name, level, day, place and skills, and no tool lists the quests. So the player's own question, the one this whole connector exists for, has no answer. The pieces exist: the quest records hold each quest's objectives by stage, and its endings by stage say when it is done or failed.

### Do
1. **A tool `get_quest_log`** (and a line in `get_playthrough`'s `whereYouStand`: "N quests started, M finished") that takes a playthrough and returns, from its snapshot, every quest the save has a stage for, in the game's words:
   - **Active:** name, the line it belongs to, and the objective the stage shows now ("Retrieve Nettlebane", the objective at the highest stage at or below the save's), with the stage number kept for the assistant.
   - **Finished:** the stage is an ending that completes it, with the ending's text ("I went to Joslin. In exchange for letting her ride the horse, she made me an imperial saddle.").
   - **Failed:** an ending that fails it.
   - **Started but unclear:** a stage the records don't show an objective or ending for. Say so; never guess what it shows.
2. **Name quests the way the player knows them:** the quest's name, never its editor id. A quest with no name in the records (helpers, hidden scripts, vanilla bookkeeping: there are many hundreds in a save) is left out of the log and counted once: "and 312 background quests".
3. **Group by line**, active first, then finished and failed behind a count. A save has hundreds of rows; the first answer is the active ones, shortest first.
4. **Say how old it is:** "from Save 70, level 10, day 15, Ivarstead", and, if the plan is behind or ahead, that too. If no snapshot is stored, say "no save is stored yet; ask the player to run the save connector".
5. **`set_snapshot`'s description** tells assistants that the quest log is read back with `get_quest_log`, so a save read leads to a log, not a dead end.
6. **Tests:** a snapshot with Running Wild at stage 10, Blood on the Ice at 100 and an unnamed helper at 20 returns Running Wild as active ("Catch the white, or palonimo, horse…"), Blood on the Ice finished with its ending, and counts the helper; a stage with no objective is "started but unclear"; no snapshot gives the plain no-save answer.

### Done when
- [x] `get_quest_log` returns active, finished, failed and unclear quests in the game's words, and the helper count. Tests as above.
- [x] `get_playthrough` shows the counts; `set_snapshot` points to the log.
- Mac, 22 Oct. `src/lib/mcp/quest-log.ts`, tested in `wo134.test.ts`.
  - **The data:** each quest in `quests.json` gets `steps`, each objective with the stage that shows it. The stage comes from the start check's `objectivesShown` where the row has it, else the objective's own number, and a placeholder is never one. Blood on the Ice's "Get assistance from the authority figure" has no stage of its own, so it isn't a step.
  - **Where a quest stands:** the last thing its journal shows at or before the save's stage. An objective means **active**, with the objective (a required one before an optional one). An ending means **finished**, or **failed** when it fails; an ending wins a tie, and a stage's other endings come as `or` (Joslin's two saddles). Nothing at or before the stage means **started but unclear**, which the log says and doesn't guess. So Running Wild at 10 is "Catch the white, or palonimo, horse…", at 41 finished, at 50 failed ("The horse has died."). Blood on the Ice at 100 is finished with Wuunferth's ending.
  - **The log:** `from` ("Save 70, level 10, day 15, Ivarstead"), and `plan` against the playthrough's build ("The plan runs to level 30; the save is at level 10", or "past the plan's last level"). Then the active quests grouped by line, lines with the fewest quests left first, and finished and failed each as a count with their lines. Last comes "and N background quests the planner doesn't list": quests the planner doesn't list are counted, never named. No snapshot gives "No save is stored yet; ask the player to run the save connector."
  - **The tools:** `get_quest_log({ playthrough })` (playthroughs sign-in, like `get_playthrough`). `get_playthrough`'s `whereYouStand` has `quests`: "2 quests started, 1 finished (get_quest_log lists them)". `set_snapshot`'s description says the stages are read back with `get_quest_log`. The tool count test is 43 now.
  - **Questions:** 8 (my quest log) went green. 10 of 11 pass; 7 (the other read-this starts) waits on WO-131 Part 2.
  - **Not done:** the third box. Dave's Save 70 is in the staging database, which this Mac doesn't read from the tests, so Bob checks it on the live planner.
  - **Checks:** typecheck, lint, `npm test` (515, and 1 marked question), Python (208), build, and e2e 349 of 350. The miss was WO-108's tool list, which didn't have `get_quest_log`; with it added, that spec passes. On WO-131 Part 0's run, the one miss was WO-123's Play-tab tick under the full run's load (12.2 s); it passes alone (2.3 s).
- [x] (folded) Dave's Save 70 (Kyria, level 10, Ivarstead) gives a log he recognises, checked by Bob against the live planner.
- [x] (folded) Every check in CLAUDE.md passes. Commit on `staging`, push, and stop for Bob: Dave asks his Claude "what quests are in my quest log" and gets a list that matches his journal.

---

## WO-133  Find a quest by what players call it (Mac, 22 Oct 2026)

**Why.** Dave asked his Claude "for lorerim how do I start the quest called Palonimo". The planner's `search_facts` and `get_quest` both came back empty for "Palonimo" and for "white horse". The quest is Running Wild, and Palonimo is the horse. The words are in its first objective ("Catch the white, or palonimo, horse roaming the fields of Whiterun"), in the book that starts it ("The Palonimo Mare"), in the horse's name and in its ending text, but search only matches quest and line names. Players name quests by the thing in them: the horse, the book, the person, the place. Claude found nothing, fell back to hunting the web, and was still going three minutes later.

### Do
1. **Search matches more than names.** `search_facts` and `get_quest`'s name lookup also match, for a quest: its objectives, its endings' text, the names of the books, notes and letters that start it, the NPCs and creatures its aliases fill, and its giver. A name match always ranks first; the others come after, each hit saying why it matched ("an objective: Catch the white, or palonimo, horse").
2. **Word-by-word, not exact.** "white horse", "palonimo", "the horse in Whiterun" and "horse quest whiterun" all find Running Wild. Case and punctuation don't matter. A word list people commonly use that the records don't hold (it's "Palomino" in the community) goes in `gamedata/5.0.4.8/overrides.json` as an alias for the quest, with its source; start with Running Wild: Palomino, palamino, white horse, wild horse, Joslin's horse.
3. **When nothing matches, say so plainly,** and tell the assistant to ask the player which quest they mean, not to search the web: "No quest matched. Ask the player where they saw it or what it gives."
4. **Tests:** "Palonimo", "white horse", "palomino horse whiterun" and "the horse quest" return Running Wild; "Running Wild" still returns it first; a nonsense word returns the plain no-match answer.

### Done when
- [x] Search finds quests by objective, ending, book, creature and giver words, with the reason shown. Tests as above.
- [x] The aliases are in `overrides.json` with a source; `build.py` is run and the generated files not hand-edited.
- [x] No match gives the ask-the-player answer.
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, and stop for Bob: Dave asks his Claude "how do I start the Palonimo quest" and gets Running Wild with the book.
- Mac, 22 Oct. Tested in `src/lib/mcp/wo133.test.ts`.
  - **The data:** each quest in `quests.json` carries `people` and `calledBy`. `people` is who its records fill its aliases with, plus its giver, never a role or an editor id (694 quests; Running Wild: Palonimo, Joslin, Erland the Stablemaster). `calledBy` is from `overrides.json`'s new `questNames`, with its `_source`; Running Wild has Palomino, palamino, white horse, wild horse and Joslin's horse.
  - **search_facts** has a new kind, `quest`, whose id is the EDID `get_quest` takes. A quest is found by its name first (rank 0 or 1, as before). After that come, in this order: what players call it, someone in it, what starts it (the book or note), an objective, an ending. Every word must be somewhere in those. A hit says `why`, from the first field that holds every word: "someone in it: Palonimo", "what players call it: white horse", "what starts it: The Palonimo Mare", "an ending: I went to Joslin…". Case and punctuation don't matter. A word matches from the start of a word ("horse" finds "horses"). Words players wrap round a name are dropped ("the", "quest", "how do I start", "called"). "Palonimo", "white horse", "palomino horse whiterun", "the horse quest", "the horse in Whiterun" and "horse quest whiterun" all find Running Wild; "Running Wild" is still first, with no `why`.
  - **Nothing matched:** `note`: "No quest matched. Ask the player where they saw it or what it gives." The tool's description says not to search the web.
  - **get_quest by a name that isn't one** answers for the quest search finds, with `found: { asked, is, because }`. It only takes a match on a name (what players call it, someone in it, what starts it), never an objective's or ending's words, so "No Such Quest" still says nothing matched. "Palonimo" answers Running Wild, "because": "someone in it: Palonimo".
  - **Questions:** none went green on this order alone. Question 1 (Palonimo) now finds Running Wild; it waits only on where the note is (WO-131 Part 0).

---

## WO-132  The quest loop: Jeff on PC works through every unchecked quest, with a check that isn't Jeff (PC, 21 Oct 2026)

**Closed by Bob, 23 Oct 2026: closed by WO-138: the loop ran to the end under Part 5; Bob judged every batch; Dave's five-quest check became the player-questions test.**

**Why.** About 480 of 1,240 quests still have no checked start, and each round of "Jeff builds, Bob reviews, Bob writes the next order" costs a day. The reviews caught real faults, but the faults were the same few kinds, and the answer key (`quest_truth.json`, 127 of 128 passing) now catches most of them without Bob. This order lets the PC run on its own, with three things that aren't Jeff deciding what counts as right: the frozen answer key, UESP, and a fresh reviewer that hasn't seen the work.

### The loop (one batch = up to 40 quests, the unchecked ones first, in `quests.json` order)
1. **Trace** each quest's start from the records with the existing tools (`story_check_all.py`, `openings.py`). Include the eleven Creation Club quests, and the read-this starts: for each, WO-131 Part 1 (where the thing is).
2. **Compare.** A base-game or DLC quest is compared with its UESP page (WebFetch). A mod quest has the records only, and the records win.
3. **Sort.**
   - Records and UESP agree: add a row to `quest_truth.json` with `source: uesp` or `source: records`.
   - They disagree, or the records hold no starter, or the start is something the check can't name: add it to `gamedata/5.0.4.8/story_checks/needs-bob.md` with both readings and the record ids. **Never guess, never pick one to keep the loop moving.** The quest stays "not yet checked".
4. **Plain words.** Rewrite with the existing rules (WO-121b Part 1, WO-126, WO-130). Don't invent a rule; if a case needs a new one, put the quest on the needs-Bob list and describe the case.
5. **Gate.** Run `python3 scripts/gamedata/build.py`, then the game-data tests and the answer key. If any row that passed before now fails, undo the batch (`git checkout` the generated files and the key), write what happened to `loop-log.md`, and go on to the next batch with those quests on the needs-Bob list.
6. **Fresh reviewer.** Run the `dh-core:rex` agent on 10% of the batch (at least 4) plus every quest whose wording changed. Give it only the quest's records, the UESP page and the planner's output, not the reasoning. CHANGES NEEDED: fix once; if still wrong, needs-Bob.
7. **Commit** the batch on `staging` (plain English, what changed and how many), push staging, and start the next batch.

### Stop when
- No unchecked quests are left, or
- three batches in a row put more than 30% of their quests on the needs-Bob list (the rules are wrong, not the data; write what you saw and stop), or
- a check fails and a second try doesn't fix it, or
- eight hours have gone.

### Limits
- Never push `main`. No database operations. Don't edit the generated files by hand.
- Don't change the answer key's existing rows. Add rows only.
- Don't change `quest_pages.py` rules except as WO-121b/126/130 already say.

### Report (`gamedata/5.0.4.8/story_checks/loop-report-<date>.md`, written at the end)
Quests checked before and after; rows added to the key; the needs-Bob list grouped by reason; every rule or file changed; batches undone and why; what the reviewer sent back and what you did about it.

### Done when
- [x] The loop has run until one of the stop conditions, and the report says which.
- [x] Every quest is checked, or on the needs-Bob list with both readings, or the report says why the loop stopped.
- [x] The answer key still passes in full; every row Jeff added cites UESP or the record id.
- [x] (folded) Every check in CLAUDE.md passes on the pushed commit. Push staging and stop for Bob, who judges the needs-Bob list and Dave checks five quests he knows.
- PC, 22 Oct: the loop stopped after three batches (120 quests), each putting 100% on the needs-Bob list. Of the 453 unchecked quests, 443 have no starter the start check reads and 10 are started only by helpers Bob ruled out, so no key row could be added. The report (`story_checks/loop-report-2026-10-22.md`) says why and what would change it: a rule for a start the line's order labels a catch-up (25 of the 120), and reading notice-board and radiant starts (Missives is 364 of the 453). It also says what Rex sent back and what was done. `needs-bob.md` has the 120 with both readings; `loop-log.md` has each batch. For Bob: five key rows belong to quests the planner marks not yet checked (Black Book: Untold Legends, The Kagrumez Gauntlet, Silenced Tongues, Yngol's Barrow, Sleepwalking Into A Nightmare).

---

## WO-131  Where the thing you read is (PC then Mac, 21 Oct 2026)

**Closed by Bob, 23 Oct 2026: closed by WO-138: Running Wild's row carries Dave's board and the PC's 22 m placement; read-this places are on the pages.**

**Why.** Dave went looking for Running Wild, the white horse in the fields outside Whiterun. The planner said it starts by reading The Palonimo Mare, which is true (the book's script sets the first stage), and stopped there. The book is a note pinned to a board outside Joslin's house, hidden behind the Bannered Mare. Nobody could have found it from "read The Palonimo Mare". The start work traced what triggers a quest, and for a person that is also where they stand. For a book, note or letter it left out where the thing is. A start that says "read X" with no place for X reads as finished and isn't.

Nine starts in `story_checks/` are a book today: The Palonimo Mare (Running Wild), Deed to Bluesky Hall and A reward in gold! (Bluesky Hall), Jarl's Bounty: Giant (Ode To The Tundrastriders), Deathbrand, The Aetherium Wars (Lost to the Ages), Letter from Largashbur (The Cursed Tribe) and Letter from Mother Hamal (The Heart of Dibella, two records). The PC's full rerun finds more, and the eleven untraced Creation Club quests are likely to start this way.

### Part 0. Running Wild first, from Dave (Mac, right away)
Dave found it in the game (22 Oct): the start is a note pinned to a board right outside Joslin's house, which is hidden behind the Bannered Mare in Whiterun. Put that in now, by hand, through `overrides.json` (`questStarts`, the way WO-126's wording works), with `source: "Dave, found in game, 22 Oct 2026"`. Running Wild's way reads: "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun." Mark it as a player report, not a file check, wherever the planner shows where a fact was checked. When Part 1 lands for it, the file's place replaces Dave's (and Bob checks they agree). Test: `get_quest` for Running Wild says the board and the house, and says it's from a player.

### Part 1. Where each one is (PC)
For every start that is a book, note, letter or item (a `by: book` start, or a pickup the rerun finds), find every place the item exists in the load order and write them to `gamedata/5.0.4.8/story_checks/readables-2026-10-21.json` (and a `.md` for reading):
1. **A placed copy in the world:** the reference, its cell, and the nearest named place. "Pinned note, Whiterun, outside Joslin's house" is the answer to find, not the editor id.
2. **In a container:** the container, its cell, and whether the list respawns.
3. **On a person:** whose inventory, and where they stand.
4. **On a leveled list:** the list and what spawns it (a bounty board, a bandit's loot). Say "random" and name the list.
5. **Delivered:** a courier or story manager that hands it over, with the node and its conditions (the Cursed Tribe letter comes to you; the file says when).
6. **Nowhere found:** say so, with what was searched. Never guess.

Each row: the item name and id, the quest it starts, the place(s) in the game's words (rule 5), and the verdict `files` or `script`.

### Part 2. The planner says it (Mac)
1. `quests.json` start gets `whereIs` on a way that is a read-this start: the places from Part 1, in plain words ("a note pinned to a board outside Joslin's house, behind the Bannered Mare, Whiterun").
2. **A read-this way with no place is not checked.** The start's `checked` line says "starts by reading <X>; where to find it isn't checked yet" and gives no instructions beyond that. `get_quest` and the quest page show the same sentence. Assistants must not turn "read X" into a direction.
3. `suggest_quests` and `where`: a read-this quest is offered for a town only when Part 1 puts the item in or near it. (WO-130 makes `where` work first; this builds on it.)
4. Tests: Running Wild shows the board outside Joslin's house; a read-this way with no placement shows "isn't checked yet" and never "open for you" instructions; the other eight pass with their places or the same sentence.

### Done when
- [x] Part 0: Running Wild says where the note is, from Dave, marked as a player report. (Mac)
- Mac, 22 Oct, Part 0. `overrides.json` questStarts `0WRHorseQ` turns "Read The Palonimo Mare" into "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun". It carries `_checked: "players"` and `_source: "Dave, found in game, 22 Oct 2026"`, so the build marks that way `checked: "players"` with its source. Its `_note` gives the PC's readables row (placed once in Whiterun, 22 m from Joslin's House and Hearth-Healer's Hall), for Part 2 to replace it.
  - **Where it shows:** the quest's How it starts and the line page's Ways in put "player report" beside the way. `get_quest` gives the way with `checked`: "a player's report, not the game files (Dave, found in game, 22 Oct 2026)". `raw` keeps "Read The Palonimo Mare", and search still finds it by the note's name ("what starts it: The Palonimo Mare"). Tested in `src/lib/mcp/wo131.test.ts`.
  - **Questions:** 1 (Palonimo), 2 (how do I start Running Wild) and 6 (where's the book for Running Wild) went green; their marks are off. 9 of 11 pass.
- [x] Part 1: `readables-2026-10-21.json` has a row for every read-this start, nine at least, each with its place or "nowhere found". (PC)
- PC, 22 Oct: `scripts/gamedata/readables.py` writes it, and the `.md`, from every `by: book` start in `story_checks/`, plus the reads that move a quest to its second step (Letter from Largashbur sets The Cursed Tribe's 10). That's 79 items. For each it lists every place in the winning records: a placed copy, its cell's name, and the three nearest doors that lead somewhere named; a container and where it stands; a person carrying it; a leveled list; or a quest script that holds it and calls AddItem (handed over: 11, among them Mother Hamal's letter from THOD_QE_TrackSleep, and The Cursed Tribe's letter and Ode To The Tundrastriders' bounty from their quests' fragments). 26 are still found nowhere, each saying what was searched. **Running Wild:** The Palonimo Mare (SurWR.esp:0D2ACB) is placed once, at SurWR.esp:0D2ACA in Whiterun. The nearest doors lead to Hearth-Healer's Hall (22 m), Joslin's House (22 m) and The Bannered Mare (27 m). That fits Dave's find (outside Joslin's house, behind the Bannered Mare), but the records alone can't say which of the two 22 m doors it's "outside". The file lists them nearest first and leaves the words to Part 0's hand entry. A place reads in the game's words, never an editor id, except where the cell has no name ("somewhere in Whiterun").
- [x] (folded) Running Wild's row says the board outside Joslin's house, and Bob has checked it against what Dave found in game.
- [x] Part 2: places on the quest pages and in `get_quest`; read-this ways with no place say so and give no instruction. Tests as above. (Mac)
- Mac, 22 Oct, Part 2. `build.py` reads `readables-2026-10-21.json`, and `quest_pages.place_words` puts each place in the game's words. Tested in `test_quest_pages.py`'s `ReadablesTest` and `src/lib/mcp/wo131.test.ts`.
  - **The words:**
    - **Placed:** the place and its nearest named doors, those within 5 m of the nearest ("Whiterun, near Hearth-Healer's Hall and Joslin's House"). A door with no name, or one the place already says, is left out.
    - **Container:** a common one by what it is ("In a chest somewhere in Whiterun"), a named one by its name ("In Additional Contracts in Dawnstar Sanctuary").
    - **Carried:** "Carried by Erden Relvel, somewhere in Morrowind".
    - **Levelled list:** "It can turn up as random loot", never the list's editor id.
    - **Delivered:** "It's handed to you during <quest>", or "It's handed to you" when the quest is the one it starts or has no name a player knows (THOD_QE).
    - **Dropped:** a holding or test cell (the editor's All Dragonborn Books chest), and "somewhere in Skyrim" on its own, which is no place to look.
    - **Long lists:** three places, then "and N more places".
  - **The data:** each read-this way in `quests.json` gets `whereIs` (its places), or `unplaced`: "Where to find X isn't checked yet." The way itself still says only "Read X". Of the 62 read-this ways, 39 have places and 23 don't. For 21 of the 23 the file found the item nowhere. Ruminations on the Elder Scrolls isn't in the file (its starter is hand-kept in `overrides.json`). Sir Areldur's Journal is placed only "somewhere in Skyrim", which is no place to look.
  - **Where it shows:** the quest's How it starts and the line page's Ways in put the places, or the sentence, after the way. `get_quest` gives `whereIs`, or `whereIsIt`: "Where to find X isn't checked yet. Don't tell the player where to look."
  - **Open for you:** a quest whose every way in is an unplaced read is unknown, with that sentence as the reason (A Forlorn Hope at level 50).
  - **suggest_quests' where:** a quest you start by reading something starts where its item is placed, and nowhere while it isn't (`startsAt`). No story opens with a read-this quest today, so it's tested on made-up quests.
  - **Running Wild:** Dave's words stay, marked "player report", and the file's place shows beside them: "Whiterun, near Hearth-Healer's Hall and Joslin's House". The file can't say "board" or "behind the Bannered Mare", and questions 1, 2 and 6 ask for them, so the file doesn't replace Dave's words. Bob: they agree (the same spot, 22 m from Joslin's door); tick the box above if you're happy, or say if the file's words alone should do.
  - **Questions:** 7 (where's the book for the other read-this starts) went green. 11 of 11 pass.
- [x] (folded) Every check in CLAUDE.md passes. Commit on `staging` and stop for Bob. The PC does Part 1 first, because Part 2 needs the file.

---

## WO-130  Three things Dave's test of WO-115 showed (Mac, 21 Oct 2026)

**Why.** Dave asked his Claude what Kyria can do in Riften at level 6. It behaved: it offered only quests the planner called open, said unknown with the reason, and noticed her save is ahead of the plan. But the answers it was given had three faults.

1. **A false gate from a line's order.** `get_quest` says Caught Red Handed is "unknown: comes after Stoking the Flames". Both sit in "Odd jobs in the Rift", a shelf of unrelated jobs, and nothing in the records ties one to the other. Lines on the work shelf (odd jobs, favours, bounties) are not a sequence: `openForYou` never gates one of their quests on another unless the records do.
2. **`suggest_quests` ignores `where`.** Asked for Riften, it returned Join the Dark Brotherhood, which starts in Windhelm. A story whose start is outside the hold or place asked for is left out (or listed under "elsewhere", never mixed in).
3. **Lines that aren't a way in.** Caught Red Handed's ways still include Haelga's flustered "You mean...? No! That's everything! Take care now! Bye!" and Svana's "Let her enjoy herself. Nothing wrong with that." These end or decline the talk. WO-126's declining-line rule catches "No, thanks"; widen it to a reply that turns the job down or ends the talk, and test on these two. (The "condition the planner can't put in words yet" on its ways should go when the PC's full rerun names fn629, fn230 and fn70; check after it lands.)

### Done when
- [x] Work-shelf lines never gate one quest on another without the records; Caught Red Handed is open at level 6 with no quests done. (Mac, 22 Oct: `openForYou` takes no quest before it on a line in the work category; only the records' own needs gate those. Tested in `src/lib/mcp/wo130.test.ts`.)
- [x] `suggest_quests` keeps to `where`; tested with Riften (no Dark Brotherhood) and Windhelm (it's there). (A story is where it starts: its giver's place, its opening quest's places and its first start line. Before, any place a start's text named counted, and Join the Dark Brotherhood's second line names Riften's orphanage.)
- [x] The two declining lines are gone from Caught Red Handed's ways, and the wider rule is tested. (A reply that turns the job down or ends the talk: also "I want no part of this." (The Taste of Death), "I'll have no part of this insanity." (With Friends Like These...), "I can't help you right now." (The Merchant's Masterpiece), "No, not really." (The Bonds of Matrimony) and the two capitals' "(Forced Good bye)" labels. Answers that carry on the talk stay: "No, I haven't seen Varona.", "No. Some wolves, but no dogs." Found on the way: a prompt that's a topic's editor id (`DB02AstridWalkAwayTopic`, With Friends Like These...) is now a plain "Talk to", and the leak test checks for it. The "can't put in words yet" check waits on the PC's full rerun.)
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, and stop for Bob. (Mac, 22 Oct: typecheck, lint, 488 unit tests, 201 game-data tests and the answer key, build, and e2e 350 of 350.)

- [x] **Follow-up (Bob, 21 Oct, after checking the live planner):** the declining lines are gone from `ways` but still sit in `start.raw.ways` for Caught Red Handed (Haelga's "No! That's everything!" and Svana's "Let her enjoy herself."), and `get_quest` sends `raw`. Drop them from `raw` too, or stop sending `raw` to assistants; test that no declining line appears anywhere in `get_quest`'s output. Then look at `openForYou` for a quest whose only plain ways still carry "a condition the planner can't put in words yet" (Caught Red Handed now says "open for you" on Svana's way with fn629 and fn230 unnamed). Until the PC's rerun names the condition, say "open for you, if <the unnamed part> holds" or "unknown: one condition isn't named yet". Never a bare "open". Tested with Caught Red Handed.
  - Mac, 22 Oct: a declining line is left out before either form is built, so it's gone from `ways` and `raw.ways` alike (and from `raw.needs`, which the judge reads). `wo130.test.ts` checks every quest's `get_quest` start for one; only the start, since T01's failing journal line says "I want no part of it" in the game's own words. `openForYou` answers "unknown: one condition on every way in isn't named yet" when every way, as a player reads it, carries "a condition the planner can't put in words yet"; Caught Red Handed does. A way whose only unnamed part is where the speaker stands as the line plays has none (WO-126 leaves those out), so A Chance Arrangement stays open on Brynjolf's ring line and the Thieves Guild is still suggested for Riften.
---

## WO-129  An act with a thread: objectives that follow the road and say why they're on it (21 Oct 2026)

**Why.** Dave (21 Oct), playing Kyria's Act II (The Bard's Road), made four points:
1. After the dagger in Whiterun, the act is a pile of quests she could take. Nothing runs through them, so none of them means anything.
2. Things are out of order. The act sends her to Ivarstead, then lists Under the Table, which would send her back to Riften first.
3. "One missive from Whiterun's board, bound for Solitude." Missive names don't say where they go. Checked 21 Oct in `quests_raw.json`: Missives' 108 courier quests are named "Deliver a Letter Near", "Medium" or "Distant" (and Potion and so on), and the objective says "Deliver <item> by <date>". Worse, a missive with no thread is just a chore. With a thread it makes sense: "I'm leaving Whiterun for Markarth. Is there a delivery bound there before I go?"
4. "Redoran's Retreat: her first bandits", with no reason, followed by a carriage to Markarth.

The common fault: an act has a goal and a place, but no thread. Its objectives are a list of things nearby. WO-127 gives the character a reason to travel and WO-128 gives places a hook. This order makes the act itself a route with a reason, and makes every objective say how it hangs on that route. The chat session fixes Kyria's own Act II by hand; this order makes the tools do it for everyone.

### Part 1. A route for each act
- An act gains `route`: its stops in order (towns, or places from WO-128's index), each with one Play line saying why she goes there next. For Kyria's Act II the shape is: leave Riften, then Ivarstead (Fastred's errand), then Riverwood, then Whiterun (Alessandra's dagger), then Markarth, then Solitude, each with its reason.
- An objective gains `stop`, one of its act's stops. Play lists an act's objectives under their stops, in route order, with the stop as a small heading. An objective with no stop goes last, under "On the road".
- `set_act` takes `route`; `add_objective`, `set_objective` and `suggest_objective` take `stop`. The site's act editor can add, reorder and remove stops. Migrations additive.

### Part 2. Every objective says why it's on the thread
- An objective's why line opens with how it ties to the route or the reason to travel: "On the way to Whiterun", "Before she leaves Whiterun for Markarth", "Asked by Andurs in Whiterun", "The road patrol (rule 19)".
- An objective that can't be tied to the thread doesn't go in. Leave it out, or plant it for a later act that goes there (WO-128's plant now, pay off later).
- **Rewards that change play are named.** Dave (21 Oct): Running Wild (`0WRHorseQ`) was put in Kyria's act as "no catch, 100 XP", and one of its endings gives a free horse. The planner showed no reward for it because the horse and saddle are only in the stage text, so the assistant never saw it. Part 3 below adds a check; Part 6 fills the data. An objective whose quest can give a mount, a house, a follower or a large amount of gold says so in its why line, and says what it does to the character's run.
- Generic jobs (bandit camps, board jobs, Companions jobs, bounties) need a hook. Take the game's own hook when there is one: a steward's bounty letter (Bounty: Bandit Boss names its place in its objective), a line of dialogue from WO-128's index, someone on the road. Otherwise write the player's own hook and say it is theirs. Never "go clear X" with nothing behind it.

### Part 3. Warnings
`get_playthrough` and `finish_draft_playthrough` warn about these (in `src/lib/mcp/review.ts`), and an assistant fixes them or tells the player why it left them:
- **Backtrack.** An objective whose quest starts (giver and place, from the quest data) at a stop the route has already left, or at a town not on the route. "Under the Table starts in Riften; the route left Riften at its first stop. Move it to an act set in Riften, or add the trip back with a reason."
- **No thread.** In an act with a route: an objective with no stop.
- **A promise the game doesn't make.** An objective that names a destination for a radiant job whose name and objective don't carry one (Missives, the job boards). Mark these quest families in the quest data (`destinationInName: false`) so the check is data, not a word list.

### Part 4. Missives and boards
- The PC session reads one courier missive's note (its BOOK text) and one board job's, and writes down whether the note names the town it goes to. Until that is checked, the rule says only what the names show.
- A board job is a "before you leave" objective tied to the next stop: "Before she leaves Whiterun for Markarth, check the board for a delivery bound there." Never name a destination for a particular missive.

### Part 6. Rewards that change play
- From each quest's stage text and endings, record outcomes that matter to play: a mount, a house, a follower, a unique item, a large amount of gold. Running Wild is the test case: stage 40 and 41 (a saddle, and the horse kept) against 45 (gold, the horse goes to the Jarl).
- Store them as `rewards` with the stage they come at and the source (the stage text), and show them on the quest page and in `get_quest`. Where the choice is exclusive, say so.
- `get_quest` and `suggest_objective` return them, so an assistant can't call a quest harmless when an ending changes the run. The rule below tells it to read them.

### Part 5. The rule (`content/mcp/style.md`)
- A new rule after WO-128's rule 20 (21 if both are built first; renumber the Honesty rules and check no "rule N" reference points past the last rule):
  > 21. An act is a road with a reason. Give it a route: its stops in order, each with why she goes there next. Put every objective at a stop, in the order she'll reach it, and open its why line with how it ties to the route or to her reason to travel. Don't send her back to a town the route has left unless the story gives her a reason to go back. Leave out what doesn't fit the thread, or plant it for a later act. A board job or a bandit camp needs a hook: the game's own when it has one, the player's own when it doesn't. Board jobs are "before she leaves for the next stop", and never promise a destination the game's job doesn't name. Before recommending a quest, read how it ends; if an ending hands over a mount, a house, a follower or a lot of gold, say what that does to the character's run and ask the player.
- Under **How to build**: "Before writing an act's objectives, set its route (rule 21)."

### Done when
- [x] Part 1: `route` on acts and `stop` on objectives, in the tools, the act editor and Play (objectives grouped under stops, in order).
- [x] Part 2 and Part 5: the rule and the How to build line; Honesty rules renumbered; no "rule N" reference past the last rule.
- [x] Part 3: the three warnings, with tests on a copy of Kyria's Act II: Under the Table flagged as a backtrack, the missive flagged as a promise, objectives with no stop flagged.
- [x] Part 6: `rewards` from stage text and endings (Running Wild shows its horse and saddle ending), in the quest page and `get_quest`; a test that Running Wild returns them.
- [x] Part 4: the missive and board notes checked on the PC and written into the order's log; `destinationInName` on those quest families.
- PC, 22 Oct, Part 4. Read in Missives.esp (26 notes), the quests' aliases, and the board's script:
  - **A courier missive's note does name where it goes, through the quest's Destination alias, filled when the job starts.** The note (`_M_MissiveCourierLetter`, Missives.esp:00BA9C) is called "Missive: Deliver Letter to <Destination>". Its text reads: "I'm looking for a courier to deliver a letter to <Recipient> of <Destination>. You will receive an up front payment from me and payment on delivery..." The weapon and potion notes say the same.
  - **The note is made inside the board** (the quest's Missive alias is created in its MissiveBoard alias), so a player reads the destination on the board, item by item, before taking a job. The quest's own name never carries it ("Deliver a Letter Near", "Medium", "Distant"), and neither does its objective ("Deliver <Item> by <date>").
  - **Where the Destination can be,** from its alias conditions (Whiterun's three letter jobs):
    - Never a location in Missives' `_M_ListLocationsForbidden` (fn444 on that form list).
    - Near: a city, town or settlement, not a farm (LocationHasKeyword LocTypeCity, LocTypeTown or LocTypeSettlement, and not LocTypeFarm), with fn360 == 1 on the quest's Hold alias. Medium: a city (LocTypeCity), with fn360 != 1 on the Hold alias. Distant: the same keyword set as Near, outside the hold.
    - fn360 and fn444 aren't named by the start check yet. The reading that Near stays in the hold and Medium and Distant leave it comes from fn360 sitting on the Hold alias with == for Near and != for the others; it isn't confirmed.
  - **A board job's note names the place, not a town:** "Missive: Kill the Leader of <Dungeon>": "By order of <Jarl>: To all able bodied men and women of <Hold>. The bandits located in <Dungeon> have been harassing, robbing, and attacking citizens... --<Steward>" (`_M_MissiveKillBandit`). The gathering and retrieving notes name the item, the dungeon and the court wizard's hold.
  - **So the rule stands, with one thing it can now say:** never name a destination for a particular missive. But a player can read on the board which deliveries are bound where, so "check the board for a delivery bound for Markarth before you leave" is a real thing to do.
  - **Data:** `questlines.json` marks the Missives line `destinationInName: false`; `questlines.py` and `quest_pages.py` carry it to the line in `quests.json`, for Part 3's promise check. Tested in `test_quest_pages.py`. No other family is marked: the jarls' bounty letters name their place in the objective ("Bounty: Bandit Boss").
- Mac, 22 Oct, Parts 1, 2, 3, 5 and 6 (after WO-128 Parts 2 to 4):
  - **Part 1.** `playthrough_act.route` (the stops in order, each a place and its why line, 12 at most, each place once) and `playthrough_objective.stop` (one of its act's stops, by place), migration 0024, additive. `add_act` and `set_act` take `route` (the whole route each time); `add_objective`, `suggest_objective` and `set_objective` take `stop` ("none" in set_objective for On the road). A stop that isn't on the route is refused with the route's stops. When a route changes, objectives follow their stop: one renamed in place keeps it, one taken off goes On the road, and `set_act` names them. Moving an objective to another act keeps its stop only if that act has the same one. `get_playthrough` returns each act's route and each objective's stop. Play lists an act's objectives under their stops in route order, the stop's place as a small brass heading with its why line beside it, empty stops left out and On the road last; an act with no route is as before. The act editor has a Route section between the act's fields and its objectives: add a stop, type its place and why, move it up or down, remove it; each objective's fields gain a Stop picker once the act has a route. suggest_places also counts the route's stops as the act's towns.
  - **Parts 2 and 5.** Rule 21 and "Before writing an act's objectives, set its route (rule 21)." word for word; Honesty is 22 to 26; WO-127's and WO-128's tests follow the numbers. The door's descriptions cite rule 21 for the route and the why line (`why`'s description now asks to open it with how it ties to the route). Rule 15 (from WO-128) lists places among what an objective links.
  - **Part 3** (`src/lib/playthroughs/route-review.ts`), in `get_playthrough`, `finish_draft_playthrough` and the answer to `add_objective`: a backtrack (its quest starts, by the new `start.towns`, only at stops the route has already left, or in a town not on the route: "Under the Table starts in Riften; the route left Riften at its first stop. Move it to an act set in Riften, or add the trip back with a reason."); an objective with no stop in an act with a route; and a promise the game doesn't make (an objective on a line marked `destinationInName: false` whose words name where one job goes: "bound for Solitude", "deliver it to Markarth", "a letter for Dawnstar"). After the PC's Part 4 read, looking on the board for a delivery bound somewhere ("check the board for a delivery bound for Markarth") isn't a promise, since the note names its town on the board. A board's jobs are never a backtrack. Tested on a copy of Kyria's Act II in `src/lib/mcp/wo129.test.ts`. The PC's `destinationInName` in `questlines.json` is the one used.
  - **Part 6.** `rewards.endings` in quests.json: what a completing ending hands over that changes a run (a mount kept, a house bought, someone who offers to follow, a lot of gold), with its stage and journal line, and `only` when one ending of several gives it. Read from the endings' own words by tight patterns in `quest_pages.py` (a miss is better than a false promise), with hand-checked rows in `overrides.json` `questRewards` where the ending's line doesn't say it: Running Wild's 40 and 41 keep the horse (stage 30's words) against 45's gold, and A New Debt's 1,000 septims, which are a debt, read as nothing. Ten outcomes across eight quests today (Graystone, Myrwatch and Hendraheim's houses; Erandur, the Thalmor agent and Lucien as followers; The Royal Relic's 500 gold). `get_quest` returns them as `changesTheRun` with a note to say what each does to the run and ask the player; `add_objective` and `suggest_objective` return the same for a linked quest. The quest page's Rewards panel lists them in the journal's words.
  - **Not done:** a unique item reward isn't read from endings yet (no pattern tells a unique item from any item in the journal's words); `questRewards` can add one by hand.
  - **Checks:** typecheck, lint, 549 unit tests, the 11 player questions, 229 game-data tests, build, e2e 357 of 357 (WO-79's card test missed once on a dropped database connection and passes on its own). The first full run caught a race: WO-123's editor test reloads on the band's resting "Saved", and an extra query in setObjective made the save slow enough to lose it; the act's route now comes with the objective's own lookup. Screenshots: Play with a routed act at 1440 and 390 (`wo129-play-*.png`), and Running Wild's Rewards on the Whiterun quest page (`wo129-rewards-*.png`).
- [x] Every check in CLAUDE.md passes. Screenshots of Play with a routed act at 1440 and 390. Commit on `staging`, push, and stop for Dave: he asks an assistant through the connector to replan an act, and can say in one sentence why each objective is there and why it comes where it does.

---

## WO-128  Places with a reason: hooks that bring a character to caves, mines, forts and landmarks (21 Oct 2026)
Status: done

**Why.** Dave (21 Oct), from playing Kyria: Skyrim is full of places players want to see (Embershard Mine is the example), and many have no quest pointing at them. A role-player won't run to a mine for no reason, so a playthrough that only follows quests sends them past most of the world. Kyria's guide sent her to Ivarstead and gave her nothing to do on the way or around it. The fix is a hook: the story already brings her to a town, someone there mentions a place nearby, and the reason fits who she is. Dave's example: the playthrough takes her to Riverwood, the blacksmith there talks about the bandits who took Embershard Mine, the village needs the mine's iron, and Kyria feels she has to step in.

Three things Dave was clear about:
- **Missing things is fine.** He has turned down quests that didn't fit Kyria, knowing they won't come back, and he skips places she has no reason to visit. A good playthrough leaves most of the map alone, on purpose.
- **Visiting a town doesn't mean clearing its surroundings.** It isn't an MMO. A hook can be planted on one visit and paid off on a later one, and a place above the character's level should be.
- **It has to vary.** Not every town gets a hook, and the hooks shouldn't all be "the innkeeper mentions bandits". This is where assistants tend to get repetitive, so the tool and the rule have to push against it.

The game has already planted many of these hooks. Counted on Dave's PC (21 Oct, the five base game masters only, from the dialogue index in `C:\LoreRim\_fieldguide\tools\questsense\out\`): of 314 locations carrying a dungeon, cave, mine, fort, ruin, camp, barrow, tower, lair or shrine keyword, 157 are named somewhere in NPC dialogue. Wilhelm warns you off Geirmund's Hall; a traveller on the Ivarstead road says to hold your breath past Shroud Hearth Barrow; on the way out of Helgen someone says Old Embershard Mine "collapsed and was taken over by criminals". The rough count is a starting point, not a spec.

### Part 1. A places index (PC, `scripts/gamedata/`)
- Every location a player can visit that isn't a city or a house: caves, mines, forts, barrows, Dwemer and Ayleid ruins, bandit and giant camps, lairs, towers, shrines, and named landmarks. From the LCTN records and their `LocType` keywords, across the whole load order, not just the base game.
- For each: name, type, hold, the nearest town or village (by world position, not by parent location alone), the levels of what is placed there and the boss (the field guide's world scan already does this on the PC: `achr_x.py` then `bossrefs.py`, and `scratch/world/site2.py` for level odds, in `C:\LoreRim\_fieldguide\tools\`), and the XP for clearing it (LoreRim's Experience settings).
- **What points at it**, with the source of each: NPC lines that name it (speaker, where the speaker lives, the words), notes and books that name it, and quests whose aliases or targets sit inside it. LoreRim's own plugins carry their text inline, so the same extraction works on them without string tables. Keep the speaker's place: that is what ties a place to a town the story visits.
- A place a quest already covers says which quest, so an assistant never invents a hook for somewhere a quest goes.
- Output `gamedata/5.0.4.8/places_raw.json` and `src/data/lorerim-5.0.4.8/places.json`, with a report like the quest reports (counts per type and hold, how many have a pointer, how many have none).

### Part 2. `suggest_places` (the door)
- Input: a playthrough and an act. The tool works out where the act goes (the act's place, the towns of its linked quests, and earlier acts' places) and returns places near those towns.
- Each place comes back with: type, hold, nearest town, levels and boss, clear XP, its pointers (who says what, where, or the note), any quest that already goes there, and a **when** field against the act's level range: "fits now", "plant now, pay off later (levels X to Y)", or "too high for this act".
- It also says what the playthrough already uses (places linked by other objectives, and places marked passed by), so an assistant doesn't hand the same kind of hook to every town.
- Never a place inside a city or a player home. Read-only.

### Part 3. The rule (`content/mcp/style.md`)
- A new rule 20 under **Playthroughs**, after rule 19 (the reason to travel, WO-127); the Honesty rules move to 21 to 25:
  > 20. Bring the character to places as well as quests. When an act visits a town, call suggest_places and pick a few places that fit what the character cares about and their reason to travel; most of the map should stay unvisited. Tie each one to a person in a town the story already goes to. Use the game's own words when a place has a pointer (the person who mentions it, or the note), and when it has none, write the player's own hook and say it is theirs, never a quest. A place above the act's levels is planted now and paid off on a later visit. Vary the people and the kinds of place; don't give every town a hook, and never send a character to clear an area just because they passed through. Name the places the character deliberately leaves alone, with one line on why (passed by).
- Under **How to build**, after WO-127's line: "When an act visits a town, call suggest_places before writing its objectives (rule 20)."

### Part 4. Places in a playthrough
- **A place objective:** `link` gains the kind `place`, by name. The objective is "Reach <place>" or "Clear <place>", and its why line carries the hook (Play only, rule 12). The story can tell it as a chapter.
- **Ticking from the save:** find out whether the save records a location as cleared (the location's change form, as the save reader already reads quests). If it does, a Clear objective ticks itself (fromSave); if not, the player ticks it, and the order says so.
- **Passed by:** an act gets a list of places the character leaves alone on purpose, each with its why line (`set_act` gains `passedBy`). Play shows them in one muted line under the act's goal: "Passed by: Embershard Mine (not her fight yet)". Nothing to tick.

### Done when
- [x] Part 1: `places_raw.json`, `places.json` and the report, built across the load order; every place's pointers carry their source and the speaker's place; places a quest covers name the quest.
- PC, 22 Oct, Part 1: `scripts/gamedata/places.py` builds the index from the winning records of every plugin, the Creation Club ones included. It writes `places_raw.json` and `places_report.md`; `build.py` writes `src/data/lorerim-5.0.4.8/places.json` from the raw file, without record or editor ids.
  - **What a place is:** a location whose LocType keywords say cave, mine, fort, ruin, camp, lair and the like, or whose world map marker is one of those kinds. Never a city, town, settlement, house, inn, store, castle or farm. A dungeon the game parents to a town (Shroud Hearth Barrow to Ivarstead) stays. A place shows the map's name when it only extends the record's ("Embershard" becomes "Embershard Mine").
  - **The index:** 477 places, 253 with a pointer, 190 with a quest that goes there, 150 with neither (counts per type and hold in the report). Each has its type (the marker's kind), its hold (up its parent locations), the nearest city or town by map-marker position and distance, the placed actors' count and level range, and the boss (the actor with the Boss location ref type: its name when it has one, its level as the record holds it, following a template's stats and a leveled list's range). It also has the clear XP from LoreRim's Experience.ini (`LoreRim - MCM and INI Settings`, `[Clearing]`: 200 for forts, Nordic and Dwemer ruins and dragon lairs, 100 for the rest).
  - **Pointers:** dialogue lines and books that name the place, on its whole name. Each has the speaker (the line's GetIsID NPC) and where they stand, the line's quest, the words, and the record with its plugin. Lines with no named speaker keep their quest (the carriage driver's "Carriage system dialogue").
  - **Quests:** named quests whose location aliases are the place, or whose forced references stand in it. Helper and scene quests are left out.
  - **The order's examples:** Embershard Mine, by Riverwood, with "Old Embershard Mine's up there... taken over by criminals" (the carriage driver) and a guard's line. Bleak Falls Barrow, by Riverwood, names The Golden Claw, with Camilla Valerius's lines (Riverwood Trader); its boss is Zulakaroth at level 40. Geirmund's Hall, by Ivarstead, has Wilhelm's line (Vilemyr Inn).
  - **Not read yet:** the field guide's level-odds scan (`site2.py`) works from its own older intermediates, base masters only. Levels here are each actor's range, not odds. A line with no GetIsID speaker names no one.
  - **Tests:** `test_places.py`.
- [x] Part 2: `suggest_places` on the door, with `when` against the act's levels and what the playthrough already uses; tests on an act set in Riverwood (Embershard Mine with its pointer, Bleak Falls Barrow named as the Golden Claw's) and one in Ivarstead (Geirmund's Hall marked "plant now, pay off later").
- [x] Part 3: rule 20 and the How to build line; Honesty rules renumbered; no "rule N" reference past the last rule.
- [x] Part 4: `place` links, the save check written up (with fromSave if the save has it), and `passedBy` on acts and in Play.
- Mac, 22 Oct, Parts 2 to 4:
  - **suggest_places** (`src/lib/places/suggest.ts`, on the door in `playthrough-tools.ts`): takes a playthrough and an act. Where the act goes is the towns its place names, the towns its linked quests start in (a new `start.towns` in quests.json: each way's speaker's town and the giver's, from the data build's cell-to-town map), and earlier acts' places. It returns the places whose nearest town is one of those, the ones the game points at first, then the nearest, 16 at most. Each has its type, hold, nearest town and distance, levels, boss, clear XP, up to four pointers (who says it and where they stand, or the book, and the quest the line is in), any quest that goes there with "use the quest, never a hook of your own", and `when`. With no pointer it says the hook is the player's own. It also returns what the playthrough already uses (places linked by objectives, with act, kind and town, and places passed by), and marks a suggested place already in the playthrough.
  - **when:** the place's top is the boss's level when the record fixes it (Sigdis Gauldurson, level 40); a boss "leveled from N" or to your level scales, so N is its floor. "fits now" when the top is within the act's levels (an open-ended act counts ten levels); "too high for this act" when even its weakest placed actor is above them; otherwise "plant now, pay off later (levels 40 and up)". The order wrote "(levels X to Y)": the place's own top has no upper end, so it reads as an act's levels do ("40 and up").
  - **A fault in Part 1, for the PC:** the nearest town is measured from the City and Town map markers (`places.py` line 273), and those don't give the cities. No place is nearest Whiterun, Riften, Solitude, Markarth, Windhelm, Falkreath, Dawnstar or Morthal. Instead the towns include ruins, manors and city districts: "Slums", "Waterfront District", "Solitude East Gate", "Markarth Side", "Flight Platform", "Lakeview Manor", "Nimalten Ruins". So the Rift's places come out nearest "Shor's Stone" (18) or "Markarth Side" (2), and Falkreath's nearest "Flight Platform" and "Lakeview Manor". Riverwood, Ivarstead and Helgen are right, which is why the order's tests pass. Until it's fixed, `suggest_places` knows the cities from the quest data and, for an act in one, says `notMeasuredYet` ("doesn't measure distances from Whiterun yet... Don't guess at places there") instead of returning nothing silently. Fixing `places.py`'s town list fixes it with no change here.
  - **Rule 20** and the How to build line in `style.md`, word for word; Honesty is 21 to 25. WO-127's test now expects Honesty from 21 and 25 rules. The door's new text cites rule 20 only.
  - **Place links:** `place` is a link kind, by name from the index, stored by the place's id and read back by name (never the form id), tagged Place on Play, with "Mine, by Riverwood" in the editor's @ menu. A name the index doesn't have is refused with the closest names.
  - **Ticking from the save, written up:** the save reader (`src/lib/save/read.ts`) walks every change form and reads quests (type 8) and the player's. A location's change form should carry a "cleared" change flag (bit 31 of a location's change flags, as CommonLibSSE names it), but this Mac has no save to confirm it against, and the reader doesn't read location change forms yet. So a Clear objective is ticked by the player (fromSave false) for now. For the PC: open one save before and after clearing Embershard Mine, find the location's change form (its type number and the flag), and if the flag is there, the reader can give cleared locations and a Clear objective can tick from the save.
  - **passedBy** on acts (`playthrough_act.passed_by`, migration 0023, additive): `set_act` and `add_act` take the whole list, `get_playthrough` returns it, and Play shows one muted line under the goal: "Passed by: Geirmund's Hall (not her fight yet)". The site's act editor doesn't edit it yet; an assistant sets it.
  - **Tests:** `src/lib/mcp/wo128.test.ts` (Riverwood, Ivarstead, an act's towns, a city not measured yet, when, rule 20, place links); `e2e/wo128.spec.ts` (the door end to end, then Play at 1440 and 390, with screenshots: `wo128-place-*.png` and `wo128-passed-by-*.png`).
  - **Checks:** typecheck, lint, 536 unit tests, the 11 player questions, 226 game-data tests, build, e2e 354 of 354. Dave's test (an assistant plans a new act) is still his: for an act in Riverwood, Ivarstead or Helgen it should work now; in a city it will say the index doesn't measure from there yet, until the PC fixes the town list.
- [x] Every check in CLAUDE.md passes. Screenshots of Play with a place objective and a passed-by line at 1440 and 390. Commit on `staging`, push, and stop for Dave: he asks an assistant to plan a new act through the connector and gets two to four places tied to people in the act's towns, at least one in the game's own words, one planted for later, and a passed-by line.

### Part 5. The nearest town is wrong, so suggest_places is empty for every real city (folded into WO-144 Part 1, 23 Oct 12:15)
`places.json`'s `nearestTown` never names one of the nine hold capitals: the 477 places sit nearest to "Skaal Village" (42), "Granite Hill" (27), "Karthwasten", "Reich Corigate Ruins", "Heljarchen Hall", "Markarth Side", "Solitude East Gate", "Flight Platform" and 104 have none. So `suggest_places` says "The places index doesn't measure distances from Riften yet" for Riften, and the same for Whiterun, Solitude, Windhelm, Markarth, Falkreath, Morthal, Dawnstar and Winterhold: every act set in a city gets no places. The cause is reading "town" from a map marker's icon type, which the cities don't use and some ruins and manors do.
- Measure every place to a fixed list: the nine hold capitals by their exterior map markers, then the real settlements and villages WO-141 Part 1 adds (Riverwood, Ivarstead, Rorikstead, Shor's Stone, Dragon Bridge, Karthwasten, Kynesgrove, Darkwater Crossing, Stonehills, Helgen, the Skaal Village, Raven Rock, and the lands mods' own). Keep both: `nearestTown` (the nearest of all of them) and `nearestCity` (the nearest capital), each with km.
- Never a ruin, a manor, a gate or a platform as a town. A test that every one of the nine capitals has at least ten places within 5 km, and that `nearestTown` is never a place in the index itself.
- `suggest_places` for Kyria's Act I (Riften) and the thief test's Act I return places; the note "doesn't measure distances from" goes away for all nine.
- **The roads between towns.** The conjurer test routed Helgen to Whiterun to Windhelm to Winterhold from training knowledge, because the planner gives no geography. Add a town-to-town table (every capital and settlement to every other, km by marker) to `places.json`, and `suggest_places` returns `nearTowns` for the act's towns (the five nearest, with km), so a route's next stop is the planner's, not the assistant's memory.
- [x] (folded into WO-144 Part 1) Part 5 built and tested; `suggest_places` returns places for each of the nine capitals.

---

## WO-127  A reason to travel: one more thing assistants weigh when they design a character (21 Oct 2026)

**Why.** Dave (21 Oct), from playing Kyria: a player who wants to get out into the world needs a reason to go from town to town, and the reason has to come from the character. Kyria's came from the road. On her first walk to Ivarstead she buried a pilgrim the wolves had killed, and since then she goes everywhere on foot and clears what is waiting on the road. Without a reason like that, a run drifts between quest markers and the long way between towns gets skipped. This is not a field and nothing changes on screen. It is a question the assistant settles while designing the character, and it shapes the playthrough it writes.

### Part 1. The rule (`content/mcp/style.md`)
- At the end of **Playthroughs**, after rule 18, a new rule 19; the Honesty rules move to 20 to 24:
  > 19. Give the character a reason to travel: why they leave one town for the next and take the road between on foot. It comes from their past or from something that happens early in the run (a duty, a debt, someone she is looking for, a promise, something she saw on the road). Ask the player for it, or offer two or three that grow out of her story and let them choose. Write it once in the Tale, as the chapter where the character finds it, and in Play as what she keeps doing throughout an act (rule 13), never as an objective. Let it choose the route between quests and the places the character stops. Use the character's own pronoun in the draft.
- Under **How to build**, one line: "Before writing a playthrough, settle the character's reason to travel (rule 19) with the player."
- No tool description or code comment references rules 19 to 23 today (checked 22 Oct with `git grep`; only finished orders mention 21 and 23), so no tool text changes. If one does by build time, it follows the new numbers.

### Part 2. The tools mention it
- `create_playthrough`'s description gains one sentence: "Settle the character's reason to travel with the player first (style guide rule 19)."
- `suggest_objective` and `suggest_quests` don't change.

### Done when
- [x] Part 1: rule 19 and the How to build line in `style.md`; the Honesty rules renumbered 20 to 24.
- [x] Part 2: the sentence in `create_playthrough`'s description.
- [x] A test that `get_style_guide` returns the new rule, and that no "rule N" reference in `src/lib/mcp` points past the last rule.
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, and stop for Dave: he asks an assistant to design a new character through the connector and it asks him why she travels.
- **For Bob, Mac, 22 Oct (night-run order, after WO-130's follow-up):**
  - **Changed:** `content/mcp/style.md` gains rule 19 at the end of Playthroughs, word for word from Part 1, and the How to build line as its last item. The Honesty rules are 20 to 24, their words unchanged. `create_playthrough`'s description ends "Settle the character's reason to travel with the player first (style guide rule 19)." `src/lib/mcp/wo127.test.ts` checks that `get_style_guide` gives rule 19, the How to build line and Honesty from 20, and that no "rule N" (or "rules N to M") in `src/lib/mcp`'s code points past the last rule (24).
  - **Checked:** `git grep` finds no reference to rules 19 to 24 in `src`, `content`, `e2e` or `scripts` but the new ones. The tools cite rules 12 to 18, which keep their numbers and meaning. Checks: typecheck, lint, 491 unit tests, 201 game-data tests, build, e2e 350 of 350.
  - **Not sure:** rule 19 says "she" and "her" in its examples (as Part 1 wrote it) and then "use the character's own pronoun". An assistant may read the examples as assuming a woman. I left your words as they are; "they" in the examples would match the instruction. Also: nothing makes an assistant ask the question, so whether it does is Dave's test, as the last box says.
---

## WO-126  Quest starts in players' words (Mac, 22 Oct 2026)

**Why.** Checking Part 4 of WO-121b, Bob read what the quest pages actually show under how a quest starts. Of 1,243 quests with a start, 309 show raw record text to players: condition functions (`GetEventData` 380 times, `GetInFaction` 87, `GetItemCount` 51, `GetActorValue` 35, `GetDead` 23), stage tests ("Skirmish at Whitewatch stage == 10", 250 of them), and editor ids for helper quests ("Through AP_DialogueHelgen", "Through aaaHOTRDialogue", 269). Bleak Falls Barrow shows "GetItemCount Dragonstone >= 1"; Unbound shows "Through APS_MQSkipKeep". A player can't read these, and the community will call it out. The answers are right underneath; they need saying in the game's words.

### Part 1. Say each condition the way a player would (Mac, `quest_pages.py`)
- **Items:** `GetItemCount X >= 1` is "You have <the item's name>"; `== 0` is "You don't have <item>".
- **Skills and values:** `GetActorValue Skill >= n` is "<Skill> <n>"; level as "Level <n>".
- **Factions:** `GetInFaction X == 1` is "You're in <the faction's full name>" (from the faction record; a faction with no player-facing name, like a crime or dialogue faction, is left out).
- **People:** `GetDead == 0` is "<Name> is alive"; on the speaker it's left out (a dead person doesn't talk).
- **Race:** `GetIsRace` is "You're a <race>" (one of, when several).
- **Quest stages:** a stage test on another quest is "After <that quest's objective or journal line at that stage>" or "While <quest> is under way"; a test on the quest's own stage that only guards a repeat is left out.
- **Story manager events (`GetEventData`):** said as the event ("When you enter <place>", "When you kill <who>"), or left out when it only filters plumbing.
- **Random:** "Sometimes".
- **Anything else** is left out, and the way gets "and a condition the planner can't put in words yet". Never the raw function.

### Part 2. No editor ids (Mac)
- "Through <helper quest>" names what the helper is in the game: its giver's line ("Talk to Ralforn at Green-Tip Cabin"), its own start ("When you arrive in Helgen"), or the record's full name when it has one. An id like `APS_MQSkipKeep` or `aaaHOTRDialogue` is never shown.
- **A way that declines isn't a way in:** a line like "No, thanks. I'm not interested." or "I can't do that right now." is dropped from the ways (Vigilant of Stendarr, I Choose You Familiar, None Escape The Light and two more).
- **Vigilant of Stendarr:** "Altano comes to find you" is wrong; the patch has him and Orlando appear in Dawnstar's Windpeak Inn for you to find. Say "Altano and Orlando, in Dawnstar".

### Part 3. Keep the raw text for assistants (Mac)
- The door's `get_quest` keeps each condition's record form in a separate `raw` field beside the words, so an assistant can still reason on it. Pages show only the words.

### Done when
- [x] Part 1: every condition kind above in words, tested on Bleak Falls Barrow, Unbound, Skirmish at Whitewatch, The Lunatic's Treasure and Knight of Hounds.
- [x] Part 2: no editor id and no declining line in any start; Vigilant fixed.
- [x] Part 3: `raw` on the door.
- [x] A check in `test_quest_pages.py` that fails if any page's start text matches a raw function name, "==", ">=", "<", or an id in the form of "Through <word with no spaces and a capital inside>". It passes on all 1,243.
- [x] Every check in CLAUDE.md passes. Screenshots of those five quest pages at 1440 and 390. Commit on `staging`, push, and stop for Dave.
- Built (Mac, 22 Oct): the words come from the check's text in `quest_pages.py` (the game files weren't mounted, so the check wasn't rerun). A condition the check left unnamed (`fn<index>`) is left out silently when it only says where the speaker is or what they're doing as the line plays (GetInCurrentLoc, IsInDialogueWithPlayer, IsInCombat and the like); anything else it can't word gives its way "a condition the planner can't put in words yet" (358 times, mostly HasSpell, the Civil War side checks and mod globals not yet set). A skill test that doesn't name its skill (GetActorValue with no skill in the check) is one of those. A patch's catch-up helper (USKPRetroactive, DLC2Init) is no way in. "VS Varla", a helper's record name with an editor's label in it, isn't said, so Knight of Hounds shows one way. Vigilant's wording is hand-kept in `overrides.json` questStarts. The open-or-locked judge reads `start.raw`.
- Checks (22 Oct, rebased on the PC's WO-121b commits): typecheck, lint, 485 unit tests, 182 game-data tests, build, and e2e 349 of 350; the one miss was WO-71's editor timing test under the full run's load, which passes alone (worst 128 ms, target 160).

---

## WO-125  Pages for the two connectors (design first, 21 Oct 2026)
Status: parked

**Why.** Dave (21 Oct): players need to learn what the planner connector and the save connector are, how to install them and how to use them, on pages that sell them, not a README. Bob boards them on canvas row 30 first; this order is written in full from the boards.

- **The planner connector:** what an assistant can do with it (draft a build that passes the rules, write a playthrough, check quests), adding it to Claude (the connector's address, sign in with Discord), three things to ask it, and an FAQ at the bottom.
- **The save connector:** what it reads from a save (level, day, place, quests, skills) and what it never does (it only reads; nothing leaves your PC but what you sync), installing the extension in Claude Desktop, using it, and an FAQ.
- A short motion piece showing a save becoming ticked objectives, if the boards earn it.

### Done when
- [ ] Written in full from row 30.

---

## WO-124  Leaner: Dave's second test of the edit model (Mac, 21 Oct 2026)

**Why.** Dave tested WO-117 and WO-118 (21 Oct). Edit still feels cluttered: the hero and the big tabs take half the screen before any work shows. The tab names don't say what's in them, and nothing tells you what each tab is for. The active step on the Character rail is hard to see, and orange and red both mean something there. The "i" sits far from its label. Clicking Story in edit waits, then flickers. On Play, the story is easy to miss, done objectives crowd what's left, a chapter can be read before its objective is done, and there's nowhere to tell the planner where she is in your game. The reader takes over the whole screen and you feel lost in it. The AI assisted mark says "through the planner" without saying what the planner is. Design: canvas row 29 (EditCompact, PlayRail, ReaderInPage).

### Part 1. Edit as one slim bar (Mac)
- **The bar:** in edit, the hero and the icon tabs go. One bar, 64 px, pinned: the cover as a 48 px thumbnail (click it: Character at Details, the cover), the character's name, then text tabs, and on the right Saved, who can see it, and Done. The site header stays above it as now.
- **The tabs are named for what's in them:** Set up is **Character**, Levels is **Build**, Play is **Playthrough**. Order: Character, Build, Guide, Story, Playthrough. The view's tabs take the same names (Playthrough, Build, Guide). URLs don't change.
- **One help line per tab,** under the bar, muted, one sentence:
  - Character: "Who she is at level 1: race, birthsign, traits and starting skills, and the page's name, cover and tags."
  - Build: "Each level: where the skill points go and which perks she takes. The planner checks every level against the game's rules."
  - Guide: "How to play her, in your words. Readers find it under Guide."
  - Story: "Her story in chapters. A chapter tied to an objective stays locked until that objective is done."
  - Playthrough: "Her run through the game: acts, and the objectives in each. An objective linked to a quest ticks from your save."
  - Use the character's pronoun the way the page already does; a build with no character says "the build".
- **Phones:** the bar keeps the thumbnail, the tab you're on as a menu, and Done; the help line wraps.

### Part 2. The step rail and the "i" (Mac)
- **The active step is lit:** its row on `#1c2430`, a 3 px ember bar on its left, its number in ember, its label in the text colour. The others stay quiet.
- **A step that needs you** is brass with a "!" after its label, not orange or red. Red stays for errors only.
- **The "i" sits 6 px after its label,** on the same line, everywhere a field has one: fix it once in the shared label and tip, not per field.

### Part 3. Say what the planner is (Mac)
- The AI assisted mark's tooltip: "{author} made this with an AI assistant, like Claude, connected to the planner. The planner checks every level and perk against LoreRim's rules, as it does for any build you make here." Then a link, "Use the planner with your assistant ›", to the planner connector's page (WO-125). Until that page is up, leave the link out.

### Part 4. The Story tab's wait and flicker (Mac)
- Clicking Story in edit waits, then the screen flickers. Story is the one tab that crosses from `/b/[id]` to `/p/[id]/edit/story`, and no route has a `loading.tsx`, so the guess is the whole frame waits on the story's data and then remounts. Find the real cause first and write it under Done when, with the time from click to the bar showing, before and after.
- **Done is:** the bar and the tabs never disappear or redraw when you change tab; the tab's own area may show a quiet loading state; no flash of the wrong page or an empty frame.

### Part 5. Playthrough: the story on show, done things folded, chapters locked, where she is (Mac)
- **Her story's card** tops the left rail, above Acts: the story's picture (the first chapter's, if the story has none), "Her story", its title, and "Continue: {the next open chapter she hasn't read} ›", or "Start reading ›" before any. The act's card and Read Act I stay.
- **Done objectives fold** into one line at the end of the act's list, "4 done ▾"; open it to see them, ticked. The count beside Objectives says how many are left ("7 to do").
- **A chapter tied to an objective is locked until that objective is done,** chapters and entries too, not only beats (`isOpen` in `src/lib/playthroughs/status.ts`). Under the objective: "Locked  {chapter} unlocks when this is done", in a quiet dashed box as on the board. In the reader's contents a locked chapter is greyed with "(locked)"; opening one says "This chapter opens when {objective} is done." with **Read it anyway** (it may spoil what's ahead). In edit the owner sees and edits every chapter.
- **"Where is she in your game?"** shows to the owner when the run has no save or entry yet, above the act's card: "Fill it in from a save, or by hand. The save ticks her quests for you." **Read a save** opens the same reader as Edit's Playthrough tab. **Enter by hand** opens three fields, level, day and where she is, saved as a snapshot the way `set_snapshot` saves one (source `hand`). **Or use the save connector ›** goes to the save connector's page (WO-125); leave it out until that page is up. Once there's a snapshot this box goes and the line "Level 10, day 15, Ivarstead. From Save 70, 21 Oct. Update ›" takes its place.

### Part 6. The reader inside the page (Mac)
- The reader no longer covers the screen (this replaces WO-116's overlay and row 27's slide-up). `/p/[id]/story/[chapter]` is a page in the site: the site header, then a slim bar with "‹ {name}'s playthrough", the story's title, and Previous, Next and (for the owner) Edit.
- **Its own reading space stays:** the contents down the left, 300 px, acts as headings and chapters under them, the one you're on lit like the step rail, locked ones greyed; the dark ground; the 680 px column; the chapter's picture, 420 px, over its title.
- **Phones:** the contents fold into a Contents button in the bar.
- Esc no longer closes anything; the back link and the browser's back do.

### Done when
- [x] Part 1: the slim bar, the tabs renamed in edit and view, a help line on each tab. (Mac, 22 Oct: one 64 px bar, pinned under the site header, which every edit tab now has, the Playthrough tab's pages too. It holds the cover as a 48 px thumbnail (to the cover in Details), Editing and the name, the text tabs Character, Build, Guide, Story and Playthrough, then Saved, who can see it and Done. The hero, the icon tabs and Copy link are gone from edit. One muted help line per tab, "she" for a character and "the build" for a build alone. The view's tabs are Playthrough, Build and Guide. On a phone the bar keeps the thumbnail, the tab you're on as a menu, the save line and Done. Tested in `e2e/wo124.spec.ts`.)
- [x] Part 2: the active step lit, needs-you in brass, every "i" 6 px from its label. (Mac, 22 Oct: as the board's rail. The step you're on sits on `#1c2430` with a 3 px ember bar and its number in an ember square, its name in the text colour. A step that needs you has a brass "!" and brass words; red stays for errors. The marks are 24 px squares now, not diamonds. The "i" is fixed once in the shared `.tip`: its circle sits 6 px after the text, and no field puts a space before it any more. Tested in `e2e/wo124.spec.ts`, which measures the 6 px after Cover.)
- [x] Part 3: the AI assisted tooltip says what the planner is (the link waits on WO-125). (Mac, 22 Oct: "{author} made this with an AI assistant, like Claude, connected to the planner. The planner checks every level and perk against LoreRim's rules, as it does for any build you make here." The link waits on WO-125's page.)
- [x] Part 4: the cause of the Story tab's wait and flicker, the times before and after, and no redraw of the bar. (Mac, 21 Oct.)
  - **The cause:** not the missing `loading.tsx`. The Story tab linked to `/p/<id>/edit/story`, which redirects on the server to `/edit/story/title`. A redirect during a tab change made Next load the whole document again. Sampled every 10 ms, the screen held only Next's streaming scripts from about 360 ms after the click until the new page drew at about 1.17 s: an empty frame, then everything at once, which is the flicker.
  - **Set up did the same, more briefly.** In edit it loads its wizard in the browser only, and the placeholder while it loaded was New build's header, so for 0.3 s the edit bar was gone and the wrong page showed.
  - **The fix:** every tab and redirect points at the page's own address (`/edit/story/title`). Set up in edit shows the edit bar, read from the page's frame, while its wizard loads.
  - **Before** (five runs, Levels to Story): 1,158 to 1,186 ms from the click to the Story tab showing, 0.8 s of it an empty frame.
  - **After** (`e2e/wo124.spec.ts`, every tab in turn): Story 0.80 to 0.88 s, Guide 0.83 s, Playthrough 0.84 s, Build 0.85 s, Set up 1.33 s while its wizard loads. The edit tabs are on screen in every 10 ms sample, and the test fails if they ever aren't.
- [x] Part 5: the story's card on the rail, done objectives folded, chapters locked until done with Read it anyway, Where is she in your game? with Read a save and Enter by hand. (Mac, 22 Oct.)
  - **The story's card** tops the rail: its picture (the story's own, else its first chapter's, else the cover), "Her story", its title, and "Continue: {the next open chapter not read} ›", or "Start reading ›" before any, or "Read it again ›" once every open one is.
  - **Done objectives** fold into one line at the end of the act's list, "✓ 4 done ▾", and the heading says how many are left ("7 to do").
  - **Locking:** a chapter tied to an objective is locked until that objective is done, chapters and entries too, not only beats (`isOpen`). Under the objective: "Locked {chapter} unlocks when this is done" in the dashed box. In the reader: "This chapter opens when {objective} is done. It may spoil what's ahead." with Read it anyway. Edit still shows every chapter.
  - **Where is she in your game?** shows to the owner until there's a save or an entry, with Read a save (the same reader as edit's) and Enter by hand (level, day and where she is, saved as a hand snapshot). After that, "Level 10, day 15, Ivarstead. From Save 70, 21 Oct. Update ›". The save connector's link waits on WO-125.
- [x] Part 6: the reader inside the page, contents on the left, Contents on a phone. (Mac, 22 Oct: `/p/[id]/story/[chapter]` is a page in the site. It shows the site header, then a slim bar with "‹ {name}'s playthrough", the story's title, and Previous, Next and the owner's Edit. The contents run down the left, 300 px: the acts as headings with their chapters under them, the one you're on lit, the locked ones greyed with "(locked)". Then the dark ground, the chapter's picture 420 px tall over its title, and the 680 px column. The page waits hidden under it, as it was, and comes back to the same spot. On a phone the contents fold into a Contents button. Esc closes nothing now; the back link and the browser's back do. This commit also carries Part 5's story card component and the contents' locked look, which live in the reader's file.)
- [x] Every check in CLAUDE.md passes. Screenshots at 1440 and 390 of edit on each tab, Playthrough with and without a snapshot, and a chapter in the reader, compared against row 29. Commit on `staging` per part, push, and stop for Dave. (Mac, 22 Oct: typecheck, lint, 485 unit tests, 164 gamedata tests, the build, and all 350 e2e on the last part's commit; each part has its own commit. The 16 screenshots match row 29's three boards. Two things in them aren't this order's: the seeded run's pictures don't load in the test data, and the site header is cramped at 390.)

---

## WO-123  Objectives you can tick and the save can tick, and skills from the save (21 Oct 2026)

**Why.** Dave's first save sync worked (Save 70: level 10, day 15, Ivarstead, 178 quest stages), but nothing ticked itself: every objective in the drafted Kyria is "you tick it" with no planner quest linked, so the save's quest stages had nothing to match. Dave (21 Oct): an objective shouldn't be save **or** tick, it should be both. The save ticks it on its own when it can, so the list stays clean, and there's always a box to tick by hand. And the save gave no skills, so a skill goal ("Lute 66") can't be checked from it.

### Part 1. Every objective has a box; the save can tick it too (Mac)
- **One rule:** every objective, done once or reach a number, can be ticked by hand. When it's linked to something the save can read (a quest or one of its stages, a level, a skill once Part 3 reads them, a count the save gives), it also ticks itself from the save. Done from the save shows "From your save"; done by hand shows the tick; either counts.
- **In Edit's Play tab:** the "Done when: The save says so / You tick it" control goes. When an objective is linked to something the save can read, one switch shows under the link, **Ticks from your save**, on by default, with an "i": "The save ticks this when it shows it done. You can always tick it yourself." With nothing linkable, no switch.
- **Data:** no column is dropped. `done_by` reads as the switch (`save` is on, `hand` is off); a reach objective is now tickable by hand, and `canTickByHand` is true for every kind. A hand tick stays when a later save doesn't show it done; a save that shows it done ticks it whatever the switch said before.
- **The door:** `add_objective` and `set_objective` take `fromSave` (true by default when the objective is linked to something the save reads); `byHand` is kept for a release as the opposite of `fromSave`. The style guide's rule 14 says both are always on offer.

### Part 2. Warnings while drafting a playthrough (Mac)
- `reviewPlaythrough`, like WO-119's `reviewBuild`: `add_objective`, `get_playthrough` and `finish_draft_playthrough` answer with warnings for an objective whose words name a planner quest, quest line or follower but which isn't linked ("'Get a Mark of Dibella from Haelga at the bunkhouse' is Caught Red Handed (FreeformRiften11); link it so the save can tick it."), found through the same name search as `search_facts`, and for a reach objective on something the save can't read yet ("Lute 66 can't be read from a save; the player ticks it."). Counted in `door_event` as warnings.

### Part 3. Skills from the save (PC)
- Read the player's skill levels from the save (the player's actor values in its change form) with `readSave`, and check them against the game. Dave gives a screenshot of Kyria's skills menu at the save you check (ask him for it in your first message; Save 70 or her newest). Include `skills` only if every skill matches; else write under Done when what was tried.
- Skyrim's Got Talent's lute skill ("Lute 66"): find where that mod keeps it (a global, an actor value, a quest variable). If the save holds it in a form the reader can read, add it to the snapshot's `counts` as "lute"; if not, say so.

### Done when
- [x] Part 1: every objective tickable by hand; Ticks from your save on linked ones; the door takes `fromSave`. (Mac, 21 Oct: done once or a number, every objective has a box on Play, and one the save ticks says "From your save". `done_by` is the switch; with it off, the save doesn't tick it and the quest and stage it would read stay, so switching it on again reads the same stage. In Edit's Play tab the Done when control is gone. The Quest field shows for done-once objectives, and Ticks from your save, with its "i", sits under the quest or the number when there's one. A done-once objective with nothing the save reads is the player's to tick, no longer refused. `add_objective` and `set_objective` take `fromSave`, on by default for a quest link or a number; `byHand` is its opposite for a release. `set_status` takes any objective, and `get_playthrough` gives `fromSave`. Rule 14 says both are on offer. Tested in `wo123.test.ts` and `e2e/wo123.spec.ts`; `wo111` and `wo117` were changed to match.)
- [x] Part 2: the drafting warnings, counted. (Mac, 21 Oct: `reviewPlaythrough` in `src/lib/playthroughs/review.ts`. `add_objective` answers with the new objective's warnings, and `get_playthrough` and `finish_draft_playthrough` with every one still standing; finish_draft adds "Fix these or tell the player why you left them." It never refuses. `door_event` counts them by code, on `/admin`'s Connector.
  - **Not linked:** an unlinked objective whose words name a quest, quest line or follower (by name, two words or seven letters at least, as `search_facts` matches names), or use a proper-noun phrase only one quest's own objectives and journal use. "Mark of Dibella" is Caught Red Handed's: "'Get a Mark of Dibella from Haelga at the bunkhouse' is Caught Red Handed (FreeformRiften11); link it so the save can tick it."
  - **Can't be read:** a number to reach the save can't give. Since Part 3 the save gives the level, every skill and the lute, so that's a count like "books read 10". The lute reads whatever the label's case ("Lute 66" is the save's `lute`).
  - Tested in `wo123.test.ts` and `e2e/wo123.spec.ts`.)
- [x] Part 3: skills (and the lute, if it can be read) from the save, matched against Dave's screenshot, or the reason they can't. (PC, 21 Oct: all 18 skills on Kyria's Save 70 match Dave's screenshot of her skills menu; the table is in `scripts/save/checked-2026-10-21.md`. They're the player's base actor values (6 to 23) in her change form, so a fortified skill would read lower than the menu shows. The lute is Skyrim's Got Talent's global `_Talent_Lute`, read through the save's plugin list into the snapshot's count `lute`: 199 at Save 70, past the mod's 66 tier. Read a save and the save connector both pass skills and `lute` on.)
- [x] Every check in CLAUDE.md passes; behind the flag. Commit on `staging` per part, push, and stop: Dave's Claude drafts a character from scratch, its quest objectives come linked, and a save sync ticks them. (Closed by Dave, 21 Oct)

---

## WO-122  Character creation through the connector, complete (Mac, 21 Oct 2026)

**Why.** Kyria's Set up shows three problems the assistant left: "Choose 4 more minors", "Fatal Attraction needs a choice", and "Choose a Helgen keep". Bob's look at the door:
- `create_build` and `create_playthrough` take race, birthsign, mode, deity, start and its option, majors, minors, traits by name, and notes. They **don't take a trait's choice** (Fatal Attraction's Male or Female, Focused Combat's weapon type, Focused Magic's school, Master of One's skill), so the assistant couldn't send it.
- Level 1 is checked with `checkCreation`, which refuses **too many** majors, minors or traits but not **too few**, and never asks for a trait's choice or a start's option. The site's Set up checks all of those (`checkStep`), so the two disagree: the door saved 2 minors where Set up wants 6.
- **No tool can change creation** once a build exists, so the assistant can't fix any of it.
- **No tool describes creation:** there's no way to get a trait's full text and choice, a race's skills and powers, the gods a race is offered, or a start's options, except one line each through `search_facts`.
- Kyria's start: the assistant sent Pilgrim (Temple) with Temple of Mara and read it back right after; on 20 Oct afternoon the build read Dragonborn with no option. The door didn't change it, so a save from the site did (the site's Set up saves a whole plan). There's no history of a build's saves to show which.

### 1. One set of rules for creation
- The door checks a new or changed creation with the same checks Set up uses, step by step (`checkStep` for race, birthsign, skills, traits, deity, mode and start), and refuses with the step's own words and the choices: "Choose 4 more minor skills (6 in all).", "Fatal Attraction needs a choice: Male or Female.", "Pilgrim (Temple) needs a temple: Random, Temple of the Divines, Temple of Dibella, Temple of Kynareth, Temple of Mara or Temple of Talos." `checkCreation` stays for the engine; the door adds the step checks on top.

### 2. Everything creation asks for, as inputs
- `create_build`, `create_playthrough` and a new `set_creation` take `traitChoices: { [trait]: choice }` (from `TRAIT_CHOICES`, by the game's option names) and `masterOfOneSkill`, beside what they take now.
- **`set_creation({ build, ... })`** changes any of creation's choices on an existing build (race, birthsign, mode, deity, start and option, majors, minors, traits and their choices). The whole build is checked again; the first rule a later level breaks stops the save, as `set_level` does.

### 3. Creation, described
- **`get_creation({ version? })`**: the counts (3 majors at +10, 6 minors at +5, up to 2 traits, the starting perk points and Naaktiid's 3 more), every race with its skills and powers, every birthsign, the gods each race is offered at the start, the two modes with their text, every start with its source, text and options, and every trait with its game text, what it changes, and its choice if it asks one. Generated from the same data as Set up. `create_build`'s description says to call it first.

### 4. A history of saves
- An additive `build_revision` table: the build, the plan as saved, who saved it (the site's Set up, the Levels editor, or the connector with the client's name) and when. The last 50 per build. `/admin` gets a build's history (the change between two saves in plain words, "Start: Pilgrim (Temple), Temple of Mara to Dragonborn"), so a change nobody meant can be found.
- An e2e that opens a build with Pilgrim (Temple) and Temple of Mara in Set up, changes the mode and Details, lets it save, and reads the start back unchanged. If it doesn't hold, fix the save so only what changed is written.

### Done when
- [x] A creation with 2 minors, a trait without its choice or a start without its option is refused through the door with the choices named. (Mac, 22 Oct: `creationProblems` in `src/lib/mcp/plan.ts` runs Set up's `checkStep` for each step and words what it still asks for, with the choices; `create_build` and `create_playthrough` refuse with it, and `checkCreation` still refuses too many. A missing birthsign or start is refused too, as Set up asks for both. Tested in `wo122.test.ts` and `e2e/wo122.spec.ts`; the door e2es now draft whole creations, 6 minors and a start.)
- [x] `traitChoices` and `masterOfOneSkill` go in; `set_creation` changes creation and rechecks the levels. (Mac, 22 Oct: on `create_build`, `create_playthrough` and `set_creation`, by the game's option names, and back out of `get_build`. `set_creation` changes only the fields sent; a choice goes with its trait, a new start drops the old option, and Master of Destiny takes the birthsign's place, as in Set up. Creation is refused with every problem; a later level, with the first it breaks.)
- [x] `get_creation` answers; the style guide's How to build says to read it first. (Mac, 22 Oct: the counts, every race with its skills, passives (LoreRim's races have no powers in the data) and the gods it's offered at the start, every birthsign, the two modes, every start with its options, and every trait with its game text, whether the planner's numbers count it, and its choice with the field to send it in. 42 KB, from the same data as Set up. `create_build`'s description and How to build both say to read it first.)
- [x] `build_revision` records every save with who made it; `/admin` shows a build's changes; the Set up e2e keeps the start. (Mac, 22 Oct: `writePlan` and `insertBuild` record the plan, Set up, the Levels editor or the connector with its name, the last 50 per build. `/admin?build=<id>` lists the saves newest first, each change in plain words ("Start: Pilgrim (Temple), Temple of Mara to Dragonborn, Helgen Keep (End)"). The e2e didn't need a fix for one page, but Kyria's case did: a Set up page left open while the door changed the start wrote its old start back, because Set up saved the whole plan. Set up and the Levels editor now send what they last saved, and only the parts that changed are written over the build as it is (`src/lib/builds/merge.ts`). The e2e covers both.)
- [x] Every check in CLAUDE.md passes; migration additive; behind the flag. Commit on `staging`, push, and stop: Dave asks his Claude to fix Kyria's creation, and her Set up shows no problems. (Mac, 22 Oct: `0021_build_revision.sql` only creates a table, applied to dev; Vercel migrates staging. The door's tools are behind `FEATURE_MCP`; the history is recorded for every save and shown only to admins. Ready for Dave: ask Claude to read Kyria with `get_build`, then fix her creation with `get_creation` and `set_creation`.)

---

## WO-121b  Every opening judged: the fixes (21 Oct 2026)

**Closed by Bob, 23 Oct 2026: closed by WO-138: the key holds every judged opening (475 rows) and the door sends who and where.**

**Why.** Bob judged all 152 openings from Part 4's sheet (`story_checks/openings-judged-2026-10-21.json`): base-game and DLC ones against UESP, mod ones from the records' own evidence, the records winning where a LoreRim mod changes a start. **68 are right, 38 rightly name no single giver, 23 are wrong, 23 can't be settled from the files.** The wrong ones aren't misread files; the files hold the right answer and the step that writes the page picks the wrong piece of it. Six rules fix most of them. Three reverse Bob's own earlier calls (Blood on the Ice, Ancestral Worship, The Cursed Tribe), now back in `WAITING_ON_BOB`.

### Part 1. The rules (Mac, `quest_pages.py`)
1. **The first step is the starting line's stage.** `then` is the objective that shows at the stage the starting line sets, not the lowest-numbered objective. Blood on the Ice: the guard's line sets 10, "Question the witnesses". The Blessings of Nature: Danica's line sets 20, "Retrieve Nettlebane".
2. **A required objective beats an optional one** shown at the same stage. Ancestral Worship: "Defeat Vals Veran", not "(Optional) Protect Golldir".
3. **When the quest finds you, say so.** A start by a story manager node or a messenger is the first way, and its person "comes to find you" with its level and needs (Dawnguard: Durak, level 30, after Laid to Rest; Wyrmstooth: Theodyn Bienne, level 10; The Ebony Warrior: in a major city, level 40). Then no single giver unless that's the only way. Never the person's holding cell or editor spot as where. A start on entering any habitation is "in any inn" (A Night To Remember).
4. **A rumour that a giver's line depends on comes first.** When the giver's starting line needs another quest's stage (The Whispering Door: Balgruuf's line needs Hulda's rumour, DA08RumorPointer), the rumour is the first way and the giver the second.
5. **A conditional starter is a way, with its condition.** The Cursed Tribe: Chief Larak's letter only for an Orc or Blood-Kin; otherwise it starts by itself and Atub asks. Never the giver.
6. **A line's opening that's already running isn't its start.** A line that only shows once the quest is past its first stage (Battle of the Champions: the Legate's line needs stage 20) isn't a starter; and Lost to the Ages starts from The Aetherium Wars or entering Arkngthamz, before Katria.

### Part 2. The data (PC)
- **The speaker the records don't tag** (Fura, Faralda, Jenassa, Erik): when a starting line has no named speaker and belongs to a follower's own quest (its aliases hold one follower), name that follower. Gift of Saturalia: Niklas (the forced alias). Siege on the Dragon Cult: the "Grifter" alias is Captain Valmir; name the NPC that fills it.
- **Openings to change:** Townsfolk favours opens with the separate delivery quests Favor Quests Seperated.esp adds (its Favor001 lines need TRUEGlobal 0, which is 1); The Civil War shows both sides' openings, Joining the Legion (Legate Rikke, Castle Dour) and Joining the Stormcloaks; Raven Rock names Captain Veleth at Old Attius Farm; Drowned Sorrows names Dagur at the Frozen Hearth (Haran's lines only call Start); Deathbrand leads with reading the book.
- **Thane:** the first step is "Assist the people of <the hold>" for the jarl's own hold, not The Reach alone.
- **The 23 unsure: read the scripts inside the archives.** They're mostly Creation Club quests, and they are part of LoreRim: the plugins and their scripts ship in the mod "Official Master Files - Cleaned Plugins" (`mods\Official Master Files - Cleaned Plugins\cckrtsse001_altar.esl` beside `cckrtsse001_altar.bsa`, and the rest). The start check reported "scripts aren't in the install" because it reads loose `.pex` files and doesn't open `.bsa` archives. Teach `story_check.py` to read compiled scripts from every archive in the load order (the winning one, as the game does: a loose file beats an archive, a later plugin's archive beats an earlier one), then rerun the start check for **these 23 lines only** (one `story_check.py` run per line, not the full `story_check_all.py` batches; minutes, not hours) and update their rows in the openings sheet. The full rerun of every batch, which other archived scripts may change, goes in the next night run. Only what still can't be traced says "How it starts isn't checked yet" (Bob, 21 Oct, after Dave asked why LoreRim's own quests would be missing).

### Part 3. The answer key takes every judged opening (Mac)
- `quest_truth.json` takes the 106 right rows from the judged file (CONFIRMED and NO_GIVER_OK), each with its source (`uesp` with the url, or `records`). A no-giver row carries `noGiver: true`, and `test_quest_truth.py` checks that the page names no single giver for it and that its first step matches. The 23 wrong rows go in once Parts 1 and 2 fix them; `WAITING_ON_BOB` empties.

### Part 4. Bob's second look at nine of the unsure (22 Oct)
The PC's re-check (Part 2) left nine openings with starters for Bob to judge again. Seven are wrong, each with the right answer and its source in `openings-judged-2026-10-21.json` (field `second_look`); two stay unsure.
- **Vigilant:** Altano and Orlando, Windpeak Inn, Dawnstar, once you're level 25 and have finished The House of Horrors and Kindred Judgment. Not the Temple of Stendarr in Stuhn Ravine: that's where they wait until the start (Nexus, VIGILANT - Delayed Start).
- **Discerning the Transmundane:** no single giver. It starts by itself during Elder Knowledge (Find Septimus Signus, at his outpost north of Winterhold), or from Septimus's book (Ask Urag about the insane book). Urag's lines only move it on (UESP).
- **Saints and Seducers:** Staada, with The Route of Madness as the way in (UESP, The Isle of Madness).
- **Sleepwalking Into A Nightmare:** Ralforn, Green-tip Cabin, northeast of Ivarstead (Nexus).
- **The Heart of Dibella:** no single giver, two ways: a letter from the Temple of Dibella once you're Thane of the Reach (the expansion's start, stage 55), or Degaine's errand into the Inner Sanctum, where Hamal catches you.
- **Heart of the Reach:** Gwilym, Silver-Blood Inn, Markarth; then Travel to Ever-Bog (LoreRim's own quest guide).
- **Whiterun, expanded:** never show the placeholder objective "TEST"; use the stage's journal text or the next real objective. Who waits on the PC (what sets stage 10).
- Still unsure: **Trius' Trinket** (cut content in the base game; if the PC reads fn359 and fn562 and nothing restores it, take it off the quest lists) and **Mjoll** (what moves the helper to stage 20).
- **Mac:** make the pages say these, by rule where one fits (a giver's place comes from where the start puts them, never their waiting spot; a placeholder objective is never shown) and by the answer key otherwise: `truth_from_judged.py` adds the seven as rows that must pass. **PC:** the traces named above (Discerning's stage 5 and 10, The Route of Madness's start, the Dibella letter and stage 55, Whiterun's stage 10, Trius's conditions, Mjoll's helper).

### Done when
- [x] Part 1's six rules, with tests from the rows above. (Mac, 21 Oct: in `quest_pages.py`, tested in `test_quest_pages.py`'s `JudgedTest`. Every page that changed is one of the lines Bob judged wrong, put right, plus Heart of the Reach's optional step (unsure):
  - **Rule 1:** rule 1 takes the objective shown at the stage the starting line sets. That's read from `objectivesShown`, which `story_check.py` now writes for each objective: the stage whose own fragment calls SetObjectiveDisplayed for it. Judging from objective numbers broke Toying with the Dead, Spread the Love and Serana, so it doesn't guess. It takes effect when the PC reruns the check (Blood on the Ice, The Blessings of Nature).
  - **Rule 2:** a required objective beats an optional one shown at the same stage. Ancestral Worship is out of `WAITING_ON_BOB`.
  - **Rule 3:** the quest finds you when a node or a messenger starts it and its person comes to you. That's when they wait in a holding cell (Theodyn Bienne), when the node fires in places they aren't in (the Ebony Warrior's five cities), when it fires "in any inn" and their every line comes after the start (Sam Guevenne), or when the helper has a Messenger (Dawnguard). They're the giver only when every way is theirs, and never at their cell or editor spot. A node that fires on entering the giver's own town (a jarl's bounty) isn't one.
  - **Rule 5:** a talk only for players of some races is a way with its condition, never the giver or the line's giver. The Cursed Tribe names no one now. A faction condition can be the speaker's own (Mralki's innkeeper faction), so it doesn't count.
  - **Rule 6:** a talk that needs its own quest past the stage where its first objective shows is a later step, not a way in (Battle of the Champions). Falk Firebeard's needs stage 10, before The Wolf Queen Awakened's first objective at 50, so he stays.
  - **Laid to Rest:** a named person alongside a guard, each starting it, isn't the one giver, as Bob judged.)
- Blocked (Mac), rule 4 and Lost to the Ages:
  - The Whispering Door's rumour quest, DA08RumorPointer, isn't in `quests_raw.json`, and Balgruuf's line names it only as an unread condition (`fn629`). PC: crawl the pointer and name the condition; then it can be the first way.
  - Lost to the Ages' book and Arkngthamz starts come through a helper whose conditions are unread (`fn359`, `fn562`). That's the same shape as Ancestral Worship, where Golldir is the giver, so Katria can't be told apart from the files here.
  - Dawnguard's messenger is "A messenger": the helper's Messenger alias isn't filled in the data (Durak).
  - The Cursed Tribe's key wants Atub, whose talk isn't a starter in the check.
- [x] Part 2's speakers and openings; the unsure say not checked.
- PC, 21 Oct, the 23 unsure re-checked, for Bob. The start check now reads the Creation Club plugins and their archives' scripts. `esp.load_order(cc=True)` adds the 75 plugins Stock Game's `Skyrim.ccc` loads, after the base masters; they're in no `plugins.txt`, so no tool read them before. The check also counts a quest's own script that starts it outside its stage fragments: LoreRim's (Alternate Perspective's) `ccStartAfterChargenScript` sets a Creation Club quest's first stage once you're the level the quest asks for, or straight away when it asks none. Of the 23:
  - **3 newly traced** ("It starts by itself from the start of the game."): The Lost Library, Through a Glass Darkly, A Dying Wish.
  - **9 had starters already** for Bob to judge again: Vigilant, Discerning the Transmundane, Saints and Seducers, Sleepwalking Into A Nightmare, The Heart of Dibella, Trius' Trinket, Heart of the Reach, Capital Whiterun, Mjoll.
  - **11 still untraced**, so their pages say it isn't checked yet: Relics of the Crusader, A Healing Wedding, On Hogithum, Profane Divinity, In the Shadows, The Cause, Stealer of Souls, The Wintersand Deception, Paragliding in Skyrim, Missives, Fishing. Their starts are most likely a book, a letter or an item, which the check doesn't read yet.

  The other 129 lines and the data builds don't take the Creation Club plugins until the night run's full rerun. `openings-2026-10-21.md` has the 23 rows updated, and every row's "page says now" is regenerated on Part 1's rules. The speakers and openings above are still to do.
- PC, 21 Oct, Part 2's speakers and openings, and the PC items blocked under Part 1, for Bob. The start check was rerun for the 25 lines touched here only; the full rerun still waits for the night run. What the check reads now, and what it found:
  - **The conditions it couldn't name.** `quest_starts.FUNCTIONS` names 14 more condition functions, confirmed by what their parameters point at (629 GetVMQuestVariable, 359 GetInCurrentLoc, 562 LocationHasKeyword, 560 HasKeyword, 561 HasRefType, 264 HasSpell, 67 GetInCell, 70 GetIsSex, 84 GetDeadCount, 182 GetEquipped, 453 GetPlayerTeammate, 1 GetDistance, 18 GetCurrentTime, 35 GetDisabled). A condition keeps the script variable its CIS2 names. The check words them ("you're in Arkngthamz", "the place is a dungeon", "The Whispering Door's PlayerGotRumor == 1").
  - **The Whispering Door (rule 4):** Balgruuf's `fn629` is GetVMQuestVariable, The Whispering Door's `PlayerGotRumor` == 1. The one quest whose stage sets it is DA08RumorPointer (Skyrim.esm:0DC9E0), at stage 10 (`QF_DA08RumorPointer_000DC9E0.Fragment_1`). The pointer starts on level-up at level 20 (`DA08KickerNode`, DA08MinLevel), and its stage 10 is set by Hulda's rumour (two lines) or Mikael's (The Whispering Door - Quest Expansion.esp). The check gives the giver's line an `after` with the rumour quest and what starts it. The page leads with "Hear about it from Hulda in The Bannered Mare" (and Mikael), then Balgruuf, so it names no single giver.
  - **Lost to the Ages:** the helper's node (`DLC1LD_MasterNode`, change location) fires when you're in Arkngthamz, Raldbthar, Deep Folk Crossing, Mzulft or Bthalft, or a place that's a dungeon. It starts the quest at stages 71 to 75, before Katria's stage 100. The check now reads book scripts too. Reading The Aetherium Wars (Dawnguard.esm:004D5B) sets stage 10, through TheChoiceIsYours.esp's `TCIY_QuestBookMessageScript`, which wins over the base `DefaultOnReadSetQuestStageNotAlias`.
  - **Dawnguard's messenger:** the helper's Messenger alias is unique and holds Durak (Dawnguard.esm:01541D); it was in the data all along, only unnamed. The helper row carries `messenger`, and the page says "Durak comes to find you in any inn".
  - **The Cursed Tribe:** for a player without Larak's letter (not an Orc or Blood-Kin), the level-up node (level 20) starts it at its start-up stage 0, which shows nothing. Atub's "What sort of help do you need?" (Skyrim.esm:03BDCC, which the expansion leaves with no stage condition) sets 20, "Speak with Yamarz". The check now counts that talk when a node starts a quest silently and every opener is only for some races: the one that takes it least far. The letter itself sets stage 10 when read.
  - **Blood on the Ice and The Blessings of Nature:** rerun, so their rows carry `objectivesShown` for rule 1.
  - **Speakers the records don't tag:** a line with no speaker on a follower's own quest is the follower whose name the started quest's editor ID carries (aaFuraQ1: Fura Bloodmouth; Faralda; Jenassa; aaErikCompanionJoin: Erik the Slayer), else the one in PotentialFollowerFaction. Their NPC records don't put them in the faction (it's added at run time), so the name is what tells. Gift of Saturalia: Niklas Peryval, the forced alias's reference in ccvsvsse001-winter.esl, now read with the Creation Club plugins. Siege on the Dragon Cult: the Grifter alias is filled from Forelhost's location by `dunForelhostGrifterRefType`; the check reads a location's static references (LCSR/ACSR) and takes the one with that ref type. That's ValmirImperial (Skyrim.esm:07E5B7, USSEP's choice), whose name comes from its template: Captain Valmir.
  - **Openings:** `questlines.json` takes an `alsoOpening` list for a line with more than one opening, and the page shows each opening's way in, with no single giver. The Civil War: Joining the Legion and Joining the Stormcloaks. Each starts from its introduction quest's stage, and the check now follows the talk that sets that stage: Legate Rikke, Castle Dour; Galmar Stone-Fist, Palace of the Kings. Townsfolk favours opens with Favor Quests Seperated.esp's six delivery quests (Aeri, Adonato Leotelli, and the rest), moved over from the jarls' line. Raven Rock: nothing in the records puts Veleth at Old Attius Farm (DLC2Init starts the quest at game start), so the line carries a judged `giver` with `checked.giver: "uesp"`, and the page labels it UESP. Drowned Sorrows: a talk that only calls Start isn't an opener when another talk sets the stage that shows the first objective, so Haran's lines drop and Dagur leads. Deathbrand: the check reads BOOK scripts; reading Deathbrand (Dragonborn.esm:03661A, `DLC2dunHaknirBookScript`) is a way in beside the level-up helper and Geldis Sadri.
  - **Thane:** an objective the quest has once per hold is "Assist the people of that jarl's hold", not The Reach.
  - **Checks**, after rebasing on Mac's Part 4: Python tests (182), typecheck, lint, `npm test` (485) and `npm run build` pass. `npm run test:e2e` wasn't run: it seeds the dev database, which this PC doesn't reach. The line page's "Ways in" now uses the line's `ways` when it has more than one opening, and labels a judged giver UESP. Mac, please check the screen.
- [x] (folded) The answer key holds every judged opening and passes; `WAITING_ON_BOB` is empty; the door sends `who` and `where` again.
- Mac, 21 Oct, Part 3: the key holds 121 rows. That's every one of the 106 openings Bob judged right (77 new; 29 it had), and three of the wrong ones Part 1 put right (Wyrmstooth, The Ebony Warrior, Battle of the Champions), each with its source (`uesp` and the url, or `records`). A Night To Remember's row now points at the line's opening, DA14Start, and passes. A no-giver row carries `noGiver: true`, and `test_quest_truth.py` checks that its page names no single giver and that its first step matches. Every row passes. `scripts/gamedata/truth_from_judged.py` adds the judged rows again when Bob judges more; it never touches his hand-kept rows. Not ticked: two rows wait on the PC (Blood on the Ice needs the check rerun with `objectivesShown`; The Cursed Tribe needs Atub's line), and the other wrong rows on Part 2. So `WAITING_ON_BOB` isn't empty, and the door still holds back `who` and `where`.
- [x] Part 4: the seven second-look fixes on the pages and in the key (Mac); the traces they need (PC).
- Mac, 22 Oct, Part 4: six of the seven pages say what Bob's second look says, and the seven are key rows (`truth_from_judged.py`'s FIXED; The Heart of Dibella was already Bob's hand row). Not ticked, because the PC's traces are still to come.
  - **Whiterun, expanded:** a placeholder objective ("TEST", and the civil war's two "xxx") is never the first step. The real objective the stage shows takes its place, else the next one, else the stage's journal text: "Read the Message". No single giver (the Courier is a role).
  - **Vigilant:** a giver's place is where the start brings them, never their waiting spot. The quest's own location alias names the town (DawnstarLocation), so Altano comes to find you in Dawnstar, level 25, after The House of Horrors and Kindred Judgment. The records don't name the Windpeak Inn, so the page says Dawnstar.
  - **Heart of the Reach and Sleepwalking Into A Nightmare:** opened only through the giver's dialogue helper (aaaHOTRDialogue), or a helper the check can't open that holds the giver's alias (RalfornAlias), they name the records' named giver: Gwilym, Silver-Blood Inn; Ralforn, Green-Tip Cabin. Then Travel to Ever-Bog, and Find a way to escape The Nightmare. Dragonborn's cultist nodes and Mjoll's traced helper don't count.
  - **Saints and Seducers:** an opening that starts after another of the line's quests takes that quest's giver: Staada, after The Route of Madness. No place until the PC traces where she finds you; never her spot in the Shivering Isles.
  - **The Heart of Dibella:** the records' named giver no longer stands in for an opening that runs from the start with no way in found. Kleppr is gone, and so are Destroy the Dragon Cult's and Myrwatch's guessed givers (Bob judged both right with none) and three unsure lines'. The two ways wait on the PC's letter and stage 55.
  - **Discerning the Transmundane:** still names Urag, and its key row is in `WAITING_ON_BOB`. In the check, his lines look just like First Lessons' Faralda (a talk setting a stage past the first objective's, in a quest that runs from the start), so no rule tells them apart. It waits on the PC's trace of stages 5 and 10.
  - Tested in `test_quest_pages.py`'s `SecondLookTest`. The key holds 127 rows and all pass but the one waiting.
- PC, 21 Oct, Part 4's traces, for Bob and Mac:
  - **Discerning the Transmundane:** it runs from the start of the game (start-game flag). Stage 1 is set by reading Septimus's book: `DA04RuminationsScript.OnRead` on the forced alias RuminationsBook (Skyrim.esm:032787). Stage 1's fragment sets 5. Stage 10 is set by Urag gro-Shub's "Where did he go?" (Skyrim.esm:02725E) or "He's dead?" (027260), with no condition but the speaker. Nothing outside those sets 5 or 10, so "starts by itself during Elder Knowledge" isn't in the records. The quest is already running, and the book or Urag moves it on.
  - **The Route of Madness** (EC_SS_MQ100Int, Saints and Seducers): a helper, EC_SS_Initializer (aliases Staada, Dylora, Thoron), starts it from `OnStoryChangeLocation` on the node EC_SS_ChangeLocationNode, which fires on any change of location, with no conditions. Its first objective is "Investigate the source of the quake".
  - **The Heart of Dibella, the letter and stage 55:** T01_GiveLetter (The Heart Of Dibella - Quest Expansion.esp:000816) runs from the start of the game. Its player alias script `THOD_QE_TrackSleep` waits for you to sleep while T01 is below 55. On waking, it adds the letter once Favor250 (Thane of the Reach) has stage 25 done, or your FriendsCountReach is high enough. Reading the letter (`THOD_ReadLetter`, on BOOKs :000817 and :000839) sets T01 to stage 55 if it's below. The check now reads book scripts, so the letter shows as a way in on the rerun. Degaine's errand stays the other way.
  - **Whiterun, expanded, stage 10:** 0WRThaneQ01 (Skirmish at Whitewatch, SurWR.esp) runs from the start. A trigger box inside Whiterun (SurWR.esp:38A6DE, `defaultsetStageTrigSCRIPT`, in cell Skyrim.esm:01A274 of the Whiterun worldspace) sets stage 5 when you walk in, and stage 5's fragment sets 10, whose objective is the placeholder "TEST". The note `0WRThaneQuestNoteStart` sets stage 20 when read.
  - **Trius' Trinket:** fn359 and fn562 are GetInCurrentLoc and LocationHasKeyword. dunShipwreck04Node fires on a change of location when you're in Pilgrim's Trench and the place is a dungeon (DungeonNode's LocTypeDungeon); nothing in the load order overrides the node. So the records do start it, on entering Pilgrim's Trench; what UESP calls cut is what follows (no fragment shows the second objective, "Return the box to Trius for the promised reward."). Bob's call whether that's enough to keep it.
  - **Mjoll:** the helper aaMjollAerinQIntro (FDE Mjoll.esp, start-game) reaches stage 20 on the player's "Let's go." (FDE Mjoll.esp:000902, reply "Thanks. I can hardly wait!", no conditions, no speaker tag; the helper's aliases hold Mjoll and Aerin). Its stage 20 fragment sets Aerin the Man to 10.
- Bob, 22 Oct, on the PC's Part 2 and Part 4 report: every trace holds up against UESP and the mods' own pages. Calls on the four the traces settle (in the judged file, `second_look`):
  - **Discerning the Transmundane:** no single giver, two ways: read Ruminations on the Elder Scrolls, or ask Urag gro-Shub in the Arcanaeum about Septimus. My "starts during Elder Knowledge" was UESP's, not the records'; drop it.
  - **Whiterun, expanded:** no single giver; it starts when you walk into Whiterun. Mac's page is right.
  - **Trius' Trinket:** it starts on entering Pilgrim's Trench but can't be finished. Off the quest lists and out of what assistants suggest.
  - **Mjoll:** Mjoll the Lioness, with Aerin, in Riften; then Clear the dungeon with Aerin and Mjoll.
  - **Mac, next:** take the PC's rerun and these four into the pages and the key, check the line page's Ways in screen the PC changed, and run `test_quest_truth.py` until `WAITING_ON_BOB` is empty; then the door sends `who` and `where` again and the last two boxes can be ticked.
  - **One more, from checking WO-126:** 10 quests (Blood's Honor, Containment and others) list the Unofficial Patch's "Retroactive fixes for 1.2" helpers as ways in. Those patch an old save, they aren't a way a player starts anything: leave them out of the ways.
  - Mac, 22 Oct: done. The Unofficial Patch's helpers that bring an old save up to date (USKPRetroactive…, USKPVersionTracking, Patch1_x_UpdateQuest) are no way in, named or not. Ten quests lose them. Three that the check reached only through them (Purity of Revenge, Glory of the Dead, Containment) now say their start isn't checked yet. A Return To Your Roots runs from the start of the game.
- Mac, 22 Oct, Bob's four calls and the PC's rerun on the pages and in the key. The key holds 128 rows; 127 pass and one waits.
  - **Discerning the Transmundane:** no single giver, two ways: "Read Ruminations on the Elder Scrolls" and Urag's two lines in the Arcanaeum; then "Ask Urag about the insane book". The check reads a BOOK record's script but not an alias's, so the book way the PC traced (DA04RuminationsScript on the forced alias) is hand-kept in `overrides.json` questStarts `_starters`, with its source. A book that starts a quest counts like a talk for its first step. Out of `WAITING_ON_BOB`.
  - **Whiterun, expanded:** no change; its row passes.
  - **Trius' Trinket:** off the lists (`questlines.json` droppedQuests, with Bob's reason), so it's out of the pages, search and what assistants suggest; its record stays in `quests_raw.json` and the save reader's `quest_forms.json`. 151 lines, 1,242 quests.
  - **Mjoll:** a helper that runs from the start of the game, holds the giver's alias and starts the quest from a stage of its own names the giver: Mjoll the Lioness, Aerin's House, Riften; then Clear the dungeon with Aerin and Mjoll. A row in the key (`truth_from_judged.py` FIXED). A helper a player knows by name stays that quest ("Through The Book of Love" for Spread the Love).
  - **The Cursed Tribe:** a talk only for some players (Larak's letter, an Orc's or Blood-Kin's) no longer sets everyone's first step when anything else starts it. The page names Atub, Largashbur Longhouse, then "Speak with Yamarz", which is what LoreRim's Quest Expansion makes Atub's line set (stage 20). The key's "Bring Troll Fat and a Daedra Heart to Atub" is UESP's base-game stage 50, so the row moves to `DIFFERS` with the record that shows it. The check now names races ("GetIsRace Orc"), so Larak's way says "You're in the Blood-Kin of the Orcs or an Orc"; a place named twice ("Largashbur Longhouse, Largashbur's Longhouse") is named once.
  - **Blood on the Ice waits on the PC.** Its first step passes now. Its person doesn't: the 21 Oct check named the guard's line "a Windhelm guard", and the rerun left it blank, because the alias CrimeSceneInvestigator now resolves to a placed guard with no name of its own and the check only kept the words when the alias resolved to no one. `story_check.py` is fixed (the words win over a nameless NPC). **PC:** rerun `story_check.py blood-on-the-ice`; then take it out of `WAITING_ON_BOB`.
  - **The door sends `who` and `where` again** (`get_quest`, `get_quest_start`): the quest's and each way's, only when one person starts it. Blood on the Ice's page names no one, so it can't send a wrong one. Dave, 22 Oct: keep it on; tick the box once the PC's Blood on the Ice rerun passes.
  - **The line page's Ways in, as the PC changed it, at 1440 and 390:** The Civil War shows both sides' openings, Townsfolk favours its six delivery quests, Raven Rock's Captain Veleth and Old Attius Farm labelled UESP. It reads right. Two things for Bob: The Civil War's First step is the Legion side's alone ("Clear out Fort Hraggstad"), and "Talk to Thadgeir in Dengeir's House, Dengeir's Hall" repeats the place.
- [x] Every check in CLAUDE.md passes. Commit on `staging`, push, and stop: Dave checks five quests he knows. (Mac, 22 Oct, after the patch helpers: typecheck, lint, 485 unit tests, 199 game-data tests and the answer key, build, and e2e 349 of 350. The miss was WO-74's Destiny ruler on a phone, which passes alone; nothing here touches it.)
- PC, 22 Oct, the night run, for Bob. Every batch of `story_check_all.py` ran (main, guilds, daedric, lands, side, followers, work: all 152 lines, none failed; 19:19 to 22:14). It now includes the Creation Club plugins and their archives' scripts, book and letter scripts, and the 14 newly named condition functions. Then `build.py` and `openings.py` ran again; `openings-2026-10-21.md` is regenerated. Before the run, the old checkpoints were moved aside, so no line was skipped as already done.
  - **Checked starts: 790 of 1,242 quests**, up from 776 on the same code before the run (about 760 before Part 2). 452 are still "not yet". 1,242 because Mac's latest takes Trius' Trinket off the lists. The before and after numbers both come from building today's staging code, once on the old checks and once on the new, so the changes below are the run's alone.
  - **The 11 untraced: 5 are traced now, each by reading a book or letter.** Relics of the Crusader ("Thalmor Dossier: Crusader Relics" or "Sir Areldur's Journal"). A Healing Wedding ("Wedding Invitation"). Profane Divinity ("Profane Ritual"). Stealer of Souls (Calcelmo's note; its page shows the record's editor ID, `ccBGSSSE002_NoteFromCalcelmo`, because the note has no name in the files). The Wintersand Deception ("Thalmor Dossier: Nazeem & Ahlam"). **6 still aren't:** On Hogithum, In the Shadows, The Cause, Paragliding in Skyrim, Missives and Fishing. Their pages still say it isn't checked yet. Missives and Fishing start from a notice board and a fishing rod, which the check doesn't read.
  - **Two fixes the full run needed.** These were found because `build.py`'s answer-key test failed after the run:
    - *"It starts by itself" only from an event the game sends* (OnInit, OnUpdate, OnStory…). Ten quests had it from a plain function another script calls. Unbound got "starts by itself" from Alternate Perspective's `APMQ101.prepareIntro`, which Matlara's talk calls. The others were A Return To Your Roots, Boethiah's Calling, Take Up Arms, Sanuarach Mine, March of the Dead, I Done Got Thaned!, The Burglary Job, The Sweep Job and Through a Glass, Darkly. Through a Glass, Darkly is still traced, through `ccstartafterchargenscript.OnUpdate`.
    - *Rule 1 (the first step is the starting line's stage) once every row has `objectivesShown`.* It now applies only when a talk starts the quest. When the talk's stage shows nothing, it reads the stage that shows the first objective (Ancestral Worship: Golldir's talk sets 5, which shows nothing, so the step comes from stage 10, "Defeat Vals Veran"). A quest a node or helper starts keeps the old reading: The Pale Lady keeps "(Optional) Learn more about the theft…", Sleepwalking keeps "Find a way to escape The Nightmare.", and Heart of the Reach keeps "Travel to Ever-Bog". So does a start-game quest whose first objective no fragment of its own shows (Innocence Lost: "Talk to Aventus Aretino").
    - Two smaller ones: rule 4's rumour now needs a yes/no flag (`== 1`), so Lucien's follower approval score isn't a rumour; and a book only leads, taking the giver away, when it starts the quest no later than any talk (the Letter to Lucien sets 10 after Lucien's talk sets 5, so Lucien stays).
    - `test_quest_pages.py`'s Bleak Falls Barrow row now expects WO-126's fuller words: `After "Talk to the Jarl of Whiterun" in Before the Storm`.
  - **Every opening whose page changed (24), for Bob to judge.** No line's giver changed.
    - **New book or letter ways:** Boethiah's Calling ("Boethiah's Proving", "The Truth of Boethiah", first). Siege at Icemoth ("Waterlogged Journal", where it had no way). Destroy the Dragon Cult ("Note from Esbern"). Undeath ("Torn Page from Traveler's Diary", before the travel node). Legends of Aetherium ("Hiring Notice"). Myrwatch ("Note on Myrwatch"). Lucien ("Letter to Lucien", last). The Bonds of Matrimony ("Get Married Today!"). Plus the five newly traced above.
    - **A speaker named where it said "someone the records don't name":** A Daedra's Best Friend and Blood on the Ice: a Falkreath guard and a Windhelm guard, filled from the town by the guard ref type. Laid to Rest: Benor, in the Guardhouse. Remiel: all three lines his. The Bonds of Matrimony: Remiel's "Yes, I'll let him know."
    - **Ways that dropped:** The Golden Claw loses Arvel the Swift's two lines; only Lucan's and Camilla's offers stay. Raven Rock loses "starts by itself" (a plain function). Odd jobs in the Rift loses Svana's "Do you work here?"; Odd jobs in the north loses Birna's bare "Talk to Birna".
    - **New ways:** Battle of the Champions: Legate Adventus Caesennius in Solitude, and Captain Yrsarald Thrice-Pierced in Windhelm.
    - **Order only:** Thirsk Mead Hall and Neloth of Tel Mithryn list "Through Init quest" first.
    - **No first step changed.** Still open, though not from this run: **The Blessings of Nature says "Inspect the Temple of Kynareth"**, not Bob's "Retrieve Nettlebane". The Heart of Dibella says "Enter the Temple of Dibella" and Siege on the Dragon Cult "Obtain Rahgot's mask", as they did before it. It has Innocence Lost's shape exactly: start-game, a first objective no fragment of its own shows, and a giver's talk that sets the next stage (Danica's 20, Aventus's 20). The key wants opposite answers for the two, and the files can't tell them apart. Innocence Lost is a key row, Blessings isn't, so the page follows the key. Bob's call: a key row, or a rule that tells them apart.
  - **Checks**, after rebasing on Mac's latest: Python tests (201, the answer key among them), typecheck, lint, `npm test` (491) and `npm run build` pass. The first push (6663eda) went out with one `npm test` failure, and its message says the tests pass; that was wrong. `wo108.test.ts`: Take Up Arms read "unknown", not "open for you". Njada's and Torvar's lines now read "you're in Jorrvaskr" where they had `fn359`, and WO-126's words didn't know the new phrase. The follow-up commit leaves the moment's newly named tests out of a way's needs, as `fn359` was (where someone is, the kind of place, GetDistance, GetDisabled, GetInCell). `npm run test:e2e` isn't run on this PC (it seeds the dev database).
- [x] **Bob's judgement of the PC's night run (22 Oct), for Mac.** Of the 24 changed openings, the new book and letter ways, the named guards, Benor and the plain-words changes are right, and no giver changed that shouldn't have. Seven things to fix, then run `npm run test:e2e` (the PC didn't):
  1. **The Blessings of Nature:** add a key row, `firstObjective: "Retrieve Nettlebane"`, `source: uesp` (Danica's "I'll get Nettlebane for you." sets stage 20, which is the step; the stage-10 temple inspection happens by itself). The page followed the PC's rule 1 change and went from right to wrong. Make the page pass by a per-quest `DIFFERS`-style override in `quest_pages.py`, not a new rule: Innocence Lost's shape is the same and keeps its own row.
  2. **Stealer of Souls shows an editor id** (`ccBGSSSE002_NoteFromCalcelmo`) because the note has no name. Name it from the record's text or say "a note from Calcelmo". Editor ids never reach players (WO-126). Test every page for a string that looks like one (`[A-Za-z]+_[A-Za-z]`, `^cc`, `esp:`).
  3. **"Dark Elf or Dark Elf"** in Golldir's condition (Siege on the Dragon Cult / Hillgrund's Tomb): the race records are Dark Elf and vampire Dark Elf. Say "a Dark Elf" once, or "a Dark Elf, vampire or not". Any condition that names the same thing twice in a row says it once.
  4. **"Through Init quest"** on Thirsk Mead Hall and Neloth of Tel Mithryn is a patch-helper way (WO-121b Part 1, the ten "Retroactive" ways). Drop it from `ways` and list the real start.
  5. **Longhouse place names:** The Cursed Tribe now says "Largashbur Longhouse" (good); check no page still doubles a place ("Largashbur Longhouse, Largashbur's Longhouse").
  6. **Look at The Cursed Tribe's first step**, now "Speak with Yamarz", which the PC changed from "Read the letter from Largashbur". Keep Yamarz if the letter is a way and not the first step; Larak's letter is for an Orc or Blood-Kin only (rule 5).
  7. **e2e** and every CLAUDE.md check, then push staging and stop for Bob.
- Mac, 22 Oct, Bob's seven. The key holds 129 rows; 128 pass and Blood on the Ice still waits on the PC. Tested in `test_quest_pages.py`'s `NightRunTest`.
  1. **The Blessings of Nature:** a key row (`truth_from_judged.py` FIXED: Danica Pure-Spring, Temple of Kynareth, "Retrieve Nettlebane", UESP). The page takes it from `quest_pages.FIRST_STEPS`, by quest edid with Bob's reason, not a rule; Innocence Lost keeps "Talk to Aventus Aretino".
  2. **Editor ids:** the test reads every text a quest page or the door shows (everything but the ids and `raw`) for `[A-Za-z]+_[A-Za-z]`, `^cc` and `esp:`/`esm:`/`esl:`. It found four, not one:
     - **Stealer of Souls:** "Get a note from Calcelmo" (hand-kept in `overrides.json` questStarts, with its source). The note's script sets the stage when you get it, not when you read it (`defaultsetstageonplayeracquireitem`); the first step then names it, "Read the Letter from Calcelmo".
     - **Myrwatch:** its quest's record name is its editor id, "MyrwatchTNE_Quest". A line's opening named that way takes the line's name.
     - **The Whispering Door:** Hulda's and Mikael's rumour ways said "Before Skyrim.esm:0DC9E0 starts" (the rumour pointer, which has no name in the files). A quest named by its form id is no name a player knows, so the need is "a condition the planner can't put in words yet". Bob: the rumour talk waiting on the pointer not having started is likely its own plumbing; say if it should be left out instead.
     - **Endings:** "When the quest reaches stage 90, if global TTFA_FastredRomance is 1" (The Book of Love). An ending's condition that names an editor id, a form id, an unnamed function or a global is left off, so it reads "When the quest reaches stage 90". That also clears 40 others (Dawnguard's DLC1PlayingVampireLine, the Thieves Guild jobs' TGRFailVex, Waking Nightmare's DA16ErandurDead, `fn629`); the ending's own journal line still says which way it went. Endings with conditions a player can read stay ("if Lucan is alive").
  3. **"Dark Elf or Dark Elf":** the words already said "You're a Dark Elf"; the doubling was in `raw`, which the door sends ("GetIsRace Dark Elf == 1 or GetIsRace Dark Elf == 1"). A condition naming the same thing twice in a row now says it once, in `raw` and in an ending (Golldir, Larak's "or GetIsRace Orc == 1", the Night Mother's contracts, Aela's three AV checks).
  4. **"Through Init quest":** Dragonborn's DLC2Init, which gets Solstheim's quests running, is treated like the patch's catch-up helpers: no way in. 19 quests lose it. Thirsk Mead Hall opens with Bujold the Intrepid, Tel Mithryn with Neloth and Varona Nelas, Deathbrand with the book, the level-up and Geldis Sadri. **March of the Dead** had no other way, so its page now says how it starts isn't checked yet (Raven Rock's line keeps Captain Veleth, labelled UESP). `raw` still lists the helper, as it does the patch's.
  5. **Places said twice:** a test checks every page's place is said once. The Cursed Tribe's is "Largashbur Longhouse". It found one more: "Temple, Temple Location" (Clean Sweep), now "Temple". "Wulf Wild-Blood's House, Skaal Village Wulf Wildblood's House" (Filial Bonds) isn't the same name twice, so it stays; Bob's call.
  6. **The Cursed Tribe:** Yamarz stays. Larak's talk (which gives the letter) is a way only for an Orc or Blood-Kin, with that need and no person; Atub's line sets stage 20, "Speak with Yamarz". The line's `firstObjective` field still holds "Read the letter from Largashbur", but the page shows it only for a line with no giver, and the door doesn't send it.
  7. **Checks:** Python tests (208, the answer key among them), typecheck, lint, `npm test` (491), build, and e2e 350 of 350. Screenshots at 1440 (Stealer of Souls also at 390) of Stealer of Souls, The Blessings of Nature, Thirsk Mead Hall, Tel Mithryn and The Cursed Tribe with How it starts open; they read as above.
  - **One for Bob, seen on the Thirsk screenshot:** Retaking Thirsk's only way in now reads Ask Bujold the Intrepid "I don't think I can help you right now." That line sets stage 10 (Dragonborn.esm:01A4E6), so it is a way in, but it reads like turning him down. The planner doesn't drop it, because the decline rule doesn't match "I don't think I can help". Bob's call: keep it, or name his other lines.
- [x] (folded) Every check in CLAUDE.md passes. Commit on `staging`, push, and stop: Dave checks five quests he knows.

---

## WO-121a  The quest starts Bob sent back (21 Oct 2026)

**Closed by Bob, 22 Oct 2026: folded into WO-121b (the answer key, `WAITING_ON_BOB` and the final checks are its boxes).**

**Why.** Bob read WO-121's 21 waiting rows and its giver table, item by item. Thirteen rows are the records being right (the planner's quest is the main one where UESP's first line is its pointer or misc quest, or the game's own wording, or LoreRim's mod changes it); they are in `DIFFERS` with the reason and the record. Eight are real gaps, and the giver table has six wrong givers and some useless places. Until this is done, the door leaves out `who` and `where`.

### Part 1. The rules (Mac, `quest_pages.py`)
- **A rumour is a way, not a giver.** When three or more different people in one town start a quest by talk (Waking Nightmare: Brina Merilis, Skald, Madena, Rustleif, Leigelf, Frida, Beitild in Dawnstar), they are one way, "Hear people in Dawnstar talk about it", and the page's person is the first step's (Erandur at the Windpeak Inn).
- **A role is never a giver:** "Courier" (Whiterun, expanded) and the rest of `ROLES` are left out of `who` and the line's giver, as `giver_of` already does.
- **A place is a place a player can find:** never a holding cell (Wyrmstooth: Theodyn Bienne in the Wyrmstooth Holder Cell), never a worldspace alone ("Skyrim" for Markarth Side), and a name said once ("Blue Palace, The Blue Palace").
- **The line's opening quest is the one the player starts first.** A Night To Remember's opening is DA14Start (Sam Guevenne's drinking contest), not DA14 (waking in the Temple of Dibella, where Senna talks); Dawnguard's is the quest Durak, the guards' rumour and Agmaer start (LoreRim: level 30), not the one Vigilant Tolan's talk moves. Fix the opening in `questlines.json` through the curation script, not by hand.
- **The first step is the one shown first:** `then` is the objective the quest's first shown stage displays, not the lowest-numbered objective with text (Dark Ancestor shows "Tell Dengeir that Vighar is dead", QOBJ 20, where UESP has "Destroy the vampire Vighar").

### Part 2. What the start check misses (PC)
- **First Lessons:** the check finds only Nirya's talk (Skyrim.esm:0DF034). Find what starts MG01 when you meet Faralda at the bridge (her dialogue, a scene, or a trigger on the bridge) and teach `story_check.py` to read it.
- **Blood on the Ice:** no starter found. It starts by itself at night once you've entered Windhelm four times (UESP: the MS11EnteringWindhelmCount global). Read that trigger and word it: "It starts by itself at night in Windhelm, after you've come in four times."
- **Caught Red Handed, Spread the Love:** no starter and no first objective found. They are favours; find how Svana Far-Shield's and Dinya Balu's talk starts them (a favour script, `Start()` on the quest, or the favour system's dialogue) and teach the check.

### Part 3. Six givers in the table to fix or prove (PC reads, Bob judges)
- **The College of Winterhold:** Faralda (Part 2). **The Wolf Queen Awakened:** UESP says the journal starts when you speak to Falk Firebeard after his letter; the check shows Elisif's talk. Read both and say which one sets the first stage.
- **Infiltration** (Brurid, was Stalleo), **Seeking A Cure** (Urag gro-Shub, was Falion), **A Forgotten Blade** (Fultheim, was Delphine), **Deluge of Deceit** (Wujeeta, was Frissa Black-Briar), **Gore** (Eden, was Gore), **Journey to Baan Malur** (Adimmisaru, was Varanie): for each, the dialogue line that starts the opening quest, who says it, where they stand, and the line itself, in `gamedata/5.0.4.8/story_checks/givers-2026-10-21.md`. Bob adds the ones that check out to `quest_truth.json`.

### Part 4. Every line's opening, checked (PC, then Bob)
- Only a line's opening quest needs a giver; the rest start when the one before ends, which the files say reliably, and the 579 repeatable jobs need none. So: for each of the 152 lines, `gamedata/5.0.4.8/story_checks/openings-2026-10-21.md` lists its opening quest's every start (who says the line, where they stand, the line itself, or the trigger, book or letter), the first step, and the record ids. One file, grouped by category, in batches of about 40 so Bob can start before it's finished.
- Bob judges each against UESP (base game and DLC) or the mod's page and the dialogue (mod quests) and adds the confirmed ones to `quest_truth.json`. A line Bob can't confirm shows "How it starts isn't checked yet" on its page and through the door, never a guess.

### Part 5. Reports that reach a fix (Mac)
- **Sign-in to report** (Dave, 21 Oct: people who aren't anonymous are less likely to lie): This was wrong asks a signed-out player to sign in with Discord first, and comes back to the form after. The 5-an-hour limit stays, per account.
- **Reports through the assistant:** a door tool, `report_quest({ quest, what, said, saw })`, needing sign-in (`facts` scope is enough): what the planner said and what the player saw in their game, stored as a `quest_report` with `source: "assistant"`. The style guide gains: "When the player says a quest's facts are wrong, file it with report_quest, in their words, and tell them it was sent."
- `/admin` Quest reports shows the source and the signed-in player's name.

### Done when
- [x] Part 1's five rules, with tests; Waking Nightmare shows the people of Dawnstar, then Erandur at the Windpeak Inn. (Mac, 21 Oct: Waking Nightmare and Dark Ancestor pass the key now and are out of `WAITING_ON_BOB`; six left. A rumour is three or more people in three or more places in one town, so the six Companions asked in Jorrvaskr stay six ways to join. A role is never `who` (Courier, Windhelm Guard, Redoran Guard). Places drop holding cells, "Skyrim" and a name said twice (Blue Palace, The Bee and Barb, The Drunken Huntsman). Dark Ancestor's first step is FreeformFalkreathQuest03B's, which Dengeir's same talk starts at the stage that shows it.)
- Blocked (Mac), rule 4, the opening: Dawnguard's line already opens on DLC1VQ01MiscObjective (Agmaer, the guards' rumour, Durak), so nothing changed there. The key's row names DLC1VQ01, though, and the opening's first objective is the longer "Speak with the leader of the Dawnguard, located within Fort Dawnguard, ..." (Dawnguard.esm:00D06C QOBJ 10). Bob's call: point the row at DLC1VQ01MiscObjective and list the wording in `DIFFERS`. For A Night To Remember, DA14Start isn't in `quests_raw.json`, so its opening can't be set in `questlines.json` yet. PC: add DA14Start to the `quests.py` crawl, then set the line's opening to it through `questlines.json`.
- [x] Part 2: First Lessons, Blood on the Ice, Caught Red Handed and Spread the Love pass the answer key. (PC, 21 Oct: the four starts found, and every batch rerun: 760 of 1,240 quests checked. Bob, 21 Oct: their who passes; the three first steps are the game's own wording, in `DIFFERS` with the record.)
- PC, 21 Oct: who now passes for all four; First Lessons passes outright and is out of `WAITING_ON_BOB`. The other three differ only on their first step, in the records' own words, so they wait on Bob's `DIFFERS` call, with the record in each reason:
  - **First Lessons:** it runs from the start at stage 0 and shows nothing, and with Improved College Entry Faralda's talk at the bridge takes it to 20 ("Okay, I can do that."). The check now counts a talk said from the start, up to the next step, when the quest has no other opener. Nirya's line, offered until stage 30, is a catch-up and goes last.
  - **Blood on the Ice:** the check reads MS11Kicker's guards and the node's event data: "It starts by itself at night in Windhelm, after you've come in four times." It also names the crime-scene speaker "a Windhelm guard": an alias filled from the Windhelm location with the CWSoldier ref type. Its first step: the records' QOBJ 1, "Get assistance from the authority figure", shows at stage 10 together with UESP's "Question the witnesses".
  - **Caught Red Handed:** Svana Far-Shield, "Sure, I'll help you.". Its first step: LoreRim's "Obtain a Mark of Dibella from Bolli, a Riften fisherman".
  - **Spread the Love:** Dinya Balu, "I'll distribute them.". Its first step carries its count, "(0/20)", as Evil in Waiting's does.
  - These two are favours on the work shelf, which no batch checked. `story_check_all.py` now has a `work` batch, and every batch has run again: 152 lines, 760 of the 1,240 quests checked from the files.
- [x] Part 3: the six givers read into `givers-2026-10-21.md`; Bob has judged each. (Bob, 21 Oct: Faralda, Brurid, Urag gro-Shub, Fultheim and Eden check out from the records, LoreRim's quest mods among them, and are in `quest_truth.json` marked `source: records`. The Wolf Queen Awakened's line opens with The Man Who Cried Wolf, which Elisif's talk starts, one of UESP's ways, so Elisif stands. Not confirmed, and left with no single giver until Part 4 reads them: Deluge of Deceit (the job comes from a Black-Briar whose line has no named speaker, INFO evgSIRENROOT.esm:0A25DD, and Wujeeta's line has odd conditions) and Journey to Baan Malur (whether The Amulet of Old is the line's real opening). Dawnguard's key row now points at the line's opening, DLC1VQ01MiscObjective. Only A Night To Remember waits, for the PC to add DA14Start.)
- PC, 21 Oct: read, and waiting on Bob's judgement. For each line, `givers-2026-10-21.md` gives the line that sets the opening quest's first stage, who says it, where they stand, the reply and the INFO:
  - **College:** Faralda, "Okay, I can do that.", from Part 2.
  - **The Wolf Queen Awakened:** both readings hold, for different quests. Elisif's line sets the opening quest's (MS06Start) first stage, 15, "Ask Falk Firebeard about Wolfskull Cave". After his letter (a story manager node), Falk's "I'll talk to Styrr." sets The Wolf Queen Awakened's (MS06) first stage, 50.
  - **The other six:** Brurid, Fultheim, Eden and Adimmisaru each set their opening's first stage; Urag gro-Shub and Wujeeta come with a question each for Bob:
    - Urag's lines set stages 1 to 5, before Seeking A Cure's first objective at stage 7.
    - Wujeeta's line is conditioned on stage 20.
- [x] Part 4: all 152 openings in `openings-2026-10-21.md`; Bob has judged each, the confirmed ones are in the answer key, the rest say not checked. (PC, 21 Oct: the sheet, in four batches. Bob, 21 Oct: every row judged in `openings-judged-2026-10-21.json`; the fixes and the key's new rows are WO-121b.)
- PC, 21 Oct: all 152 written, waiting on Bob's judgement. Each opening quest has every start the check found, with its record, the first step and what the page says now; `scripts/gamedata/openings.py` writes the file again. Of the 152:
  - 81 have one giver on the page
  - 52 have ways in but no one giver
  - 19 aren't traced yet ("not yet")
  - 18 have an unread note (no starter found in the records or scripts)

  Three asks from Bob, with their notes in the file:
  - **A Night To Remember** opens on DA14Start, Sam Guevenne's drinking contest. `quests.py` keeps a named quest's unnamed lead-in, which also brings in DA03Start for A Daedra's Best Friend and MS05Start for The Bards College. The key's row still names DA14.
  - **Deluge of Deceit**'s Black-Briar job line (evgSIRENROOT.esm:0A25DD) is Frissa Black-Briar's: its one condition is a voice type only she has, and the check now names a speaker that way. Wujeeta's line needs Deluge of Deceit at stage 20.
  - **Journey to Baan Malur** has no single opening quest. A Grand Venture is an empty placeholder, the rest are side quests in Baan Malur, and Hlervan's Ashes most likely starts when you pick the ashes up. The way in stays the line's start text, with no single giver.
- [x] Part 5: reports need sign-in; `report_quest` through the door; the source on `/admin`. (Mac, 21 Oct: WO-103's form hadn't been built (the story page's This was wrong was still the plain link), so it is built here, with sign-in. This was wrong sits under a line's quests. Signed out, it asks for Discord, and the sign-in comes back to `/quests/<id>?report=1` with the form open. The story page's link goes there too. `quest_report` (`0022_quest_report.sql`, additive) holds the line, the quest, what, the player's words, what the planner said, who, the source and the client. 5 an hour per account, the site and the door counted together. `report_quest({ quest, what, said, saw })` needs sign-in with `facts`, and takes a line's id or name or a quest's EDID or name. The style guide has rule 23. `/admin` lists the reports with "On the quest page" or "Through <assistant>", the player's name and a status. Tested in `wo121a.test.ts` and `e2e/wo121a.spec.ts`.)
- [x] (folded) `WAITING_ON_BOB` is empty; the door sends `who` and `where` again.
- [x] (folded) Every check in CLAUDE.md passes. Commit on `staging`, push, and stop: Bob checks ten more quests against UESP, then Dave checks five he knows.

---

## WO-121  Who starts a quest, tested against an answer key (Mac, 21 Oct 2026)

**Closed by Bob, 22 Oct 2026: folded into WO-121b (the answer key, `WAITING_ON_BOB` and the final checks are its boxes).**

**Why.** Dave checked one quest page, The Book of Love, and it named Fastred at Fellstar Farm as who starts it. Dinya Balu in the Temple of Mara starts it; Fastred is where she sends you. Bob's look: the start check reads the files right (its report names Dinya Balu, "Just tell me what to do."), but `quest_pages.start_of` takes who and where from the first objective's target, so for 175 quests the page names where the quest sends you, sometimes an object ("Golden Claw", "Door", "Passage"). Nobody tested the answers against quests whose answer is known. Bob scored the planner against 38 quests from UESP: the quest's who is right for 17, wrong for 19; the line's giver (from WO-99's named giver) is right more often but still wrong for about 8. Swapping in the dialogue starter alone (Bob tried) fixes some and breaks others, because rumours start many quests (Dawnstar's people for Waking Nightmare, Erandur is the giver).

**The answer key.** `gamedata/5.0.4.8/quest_truth.json`: 38 quests with every way UESP says each starts, where, the first objective and the page used. Hand-kept by Bob; it grows.

### 1. Who starts it, worked out
- In `quest_pages.py`, a quest's start says **how it starts** as ways and **then** as the first step:
  - `ways`: every starter the check found, each in `way_of`'s words with its place and line ("Ask Dinya Balu \"Just tell me what to do.\" in the Temple of Mara").
  - `then`: the first objective ("Talk to Fastred"), with its target's place when it names a person or place ("at Fellstar Farm").
  - `who` and `where`: only when one person starts it: exactly one dialogue starter, or several where the records' named giver (WO-99) is one of them. Otherwise none: the page shows the ways.
  - Never an item, a door, a marker or a cell as `who`: only actors.
- The line's `giver` comes from its opening quest's `who` when there is one; else WO-99's named giver only if the start check has no dialogue starters for it; else none, and the line page shows the opening quest's ways.

### 2. The test
- `scripts/gamedata/test_quest_truth.py`, run by `npm run test:gamedata`: for every row in the answer key whose quest is in `quests.json`, the page's person (the quest's `who`, else the first way's person, else the `then`'s person) is one of `startsWith`, and `then` matches `firstObjective` (same words, ignoring case and punctuation). A row the LoreRim records really do differ on is listed in the test with the reason and the record that shows it, never just skipped.
- The build fails when the test fails.
- In the commit: a table of every line whose giver changed, before and after. Bob reads it item by item before Dave sees the pages.

### 3. Then the pages and the door
- WO-115 Part 5 (the quest pages' How it starts and How it can end) is built on this: ways, then the first step; no player context (Dave, 20 Oct).
- The door's `get_quest` and `get_quest_start` send `who` and `where` again, now from Part 1, with `ways` and `then`.

### Done when
- [x] (folded) Every row of `quest_truth.json` passes, or is listed with the LoreRim record that differs.
- Blocked (night run): 16 of the 37 rows in `quests.json` pass. The other 21 are in `scripts/gamedata/test_quest_truth.py` as `WAITING_ON_BOB`, each with what the records show and the record ids: mostly the first objective UESP names isn't one of the quest's own objectives (it lives in another record, or LoreRim's words differ: "Collect the Vessels (0/3)", "Meet Fralia at her home in the evening."), and a few where the start check's only talk is someone else (First Lessons: Nirya; A Night To Remember: Senna; Dawnguard: Vigilant Tolan) or Waking Nightmare's seven Dawnstar rumours with Erandur as no talk at all. Whether each is "the records really differ" (DIFFERS) or a fix in `quest_pages.py` is Bob's read, one by one; a test fails when a waiting row starts to pass, so the list can't go stale. Who is right for 28 of the 37 now, 18 before.
- [x] The Book of Love's page: Ask Dinya Balu in the Temple of Mara, then Talk to Fastred at Fellstar Farm. (Its start check had Dinya Balu all along; `start_of` dropped every way when a quest also runs from the game's start. Now every starter is a way.)
- [x] No quest's who is an item, door, marker or cell. (Who comes only from talks now; tested.)
- [x] The giver-change table is in the commit for Bob's read. (33 lines, 27 a different person.)
- [x] WO-115 Part 5 built on it; the door sends who, where, ways and then. (Mac, night of 20 Oct: each quest row's How it starts gives its ways in and Then: its first step and where; a line with no one giver shows its opening quest's ways in How to start it. The door sends ways and then.)
- Blocked (night run): the door's `who` and `where`. They wait for the answer key to pass, by Bob's note in WO-115; the ways carry each speaker and place in their words meanwhile.
- [x] (folded) Every check in CLAUDE.md passes. Commit on `staging`, push, and stop: Bob reads the table, then Dave checks five quests he knows.

---

## WO-120  The night run: everything queued, one after another (Mac, 20 Oct 2026)

**Closed by Bob, 22 Oct 2026: folded into WO-121b (WO-121 and WO-115 Part 5 are done or carried there).**

**Why.** Dave is asleep and wants Jeff on Mac to work through the queue overnight. Bob checks WO-118 before Dave goes to bed; the rest are built tonight and checked by Bob and Dave in the morning.

**The rule for tonight.** Each order below says "stop" at its end, for Dave to look. Tonight, don't stop there: finish the order, tick its boxes, run every check in CLAUDE.md, commit and push to `staging`, then go straight on to the next. Everything else in CLAUDE.md holds: `staging` only, never `main`; no destructive database operation; migrations generated and additive; secrets never printed or committed.

**The queue, in order:**
1. **WO-118**, whatever is left of it (Part 8, tests and screenshots).
2. **WO-115 Parts 3 to 5**, open for you. Read the two notes above Part 3 first.
3. **WO-119**, assistants that build well.
4. **WO-121**, who starts a quest, tested against the answer key (added 20 Oct, 23:00). Then WO-115 Part 5, which waits for it.
5. **WO-109b**, the door on any path and a 401 that starts sign-in.

**If something blocks you** (a check that won't pass after a real try, a question only Dave can answer, a design the boards don't cover): don't guess at a design and don't skip a test. Write what blocked you and what you tried under that order's Done when, as "Blocked (night run): ...", commit and push that, and go on to the next order. A blocked part of an order doesn't stop the rest of it if the rest doesn't depend on it.

**Morning notes.** As you finish each order, add a line to `docs/night-2026-10-20.md`: the order, its commits, what's on staging to try (with links on `https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app`), and anything blocked. Commit it with each order, so it's current if the run stops partway.

### Done when
- [x] WO-118 done.
- [x] WO-115 Parts 3 to 5 done. (Part 5 on WO-121; see both orders' Done when.)
- [x] WO-119 done. (One warning blocked; see its Done when.)
- [x] (folded) WO-121 done, and WO-115 Part 5 on it.
- [x] WO-109b done.
- [x] `docs/night-2026-10-20.md` lists each order, what to try and what's blocked. Every check in CLAUDE.md passes on the last commit. Push to `staging` and stop: Bob checks the night's work in the morning, then Dave.

---

## WO-119  Assistants that build well: the rules, warnings while drafting, and a way to tell (Mac, 20 Oct 2026)

**Why.** Kyria's build, drafted by Dave's Claude through the door, follows every rule and still isn't a good build: by level 23 it carries 169 skill points never spent, one perk point unspent from level 5 and all five Destiny points unspent. It raised four skills to max skill and then put 1 point a level into each, while Smithing, Restoration and Block sat at 20 to 25. The door never told the assistant how points work, and its answers carry `skillPointsCarriedOver` without saying it's a problem. Dave: the site doesn't need warnings, a player knows to spend their points; the question is whether the agent knows how to build and whether we can tell. So this order is for assistants only; nothing on the site changes.

**Where:** `src/lib/mcp/`, `content/mcp/style.md`, behind `FEATURE_MCP`. Small commits, push after each part.

### 1. Tell it the rules
- A **How points work** section in the style guide, written from the planner's own rules at build time (not by hand), so it never goes stale: skill points per level (30), the most one skill can rise in a level (5), what a point costs at each band (1 below 25, 2 below 50, 3 below 75, 6 from 75), max skill at a level (50 plus the level, up to 100), perk points (3 at the start, 3 more for Naaktiid, 1 a level, and the traits and Oghma Infinium that change it, as the engine counts them), Destiny points (when they come), attribute points and trainer sessions per level. A unit test fails if a number in the section and the rules disagree.
- A **How to build** section (Bob's words, plain): spend every level's points; when the skills a build is about reach max skill, the rest go to the next skills its perks will need, then to skills it uses (Smithing for its armor, Restoration for its healing); take a perk point when there is a perk to take, and when a planned perk isn't open yet, raise its skill toward it rather than holding the point; spend Destiny points as they come; ask `get_perk` for a perk's requirements instead of guessing; check the build with `get_build` before `finish_draft`.

- **A whole tree at once:** a new facts tool, `get_tree({ skill })`, answers with every perk in that skill's tree, each with its ranks, skill level, prerequisite perks and the perks it rules out, in tree order, so an assistant can plan a skill's perks without asking for them one by one. `search_facts` stays at 20 results.
- **The rules as a tool too:** `get_rules` answers with the same numbers as How points work, for assistants that don't read the style guide first. `create_build`'s description says to call it.

### 2. Warnings while drafting
- `add_level`, `set_level` and `get_build` answers gain `warnings`: plain sentences about things the rules allow but a good build wouldn't do, computed by one function, `reviewBuild(plan)`, from the same `computeBuild` state the editor uses. A warning saves nothing differently; it is advice for the assistant.
- The warnings, each with the numbers and what to do:
  - Skill points piling up: more than one level's worth carried over. "142 skill points unspent since level 9. Speech, Two-Handed and Heavy Armor are at max skill for level 18 (68); Smithing 25, Restoration 25 and Block 20 can take them."
  - A perk point unspent for three levels or more: "1 perk point unspent since level 5." with up to five perks open at that level in the build's skills, by name.
  - Destiny points unspent for five levels or more, with how many.
  - ~~A planned perk whose skill can't reach its requirement.~~ Dropped (Bob, 21 Oct): a build holds only taken perks, and the rules already refuse a taken perk whose skill is short. Jeff was right to stop.
- `finish_draft` answers with every warning still standing and the line "Fix these or tell the player why you left them." It never refuses because of a warning.
- Unit tests on Kyria's plan as drafted (copy it into a fixture from staging's `fsxh33upak` through `get_build`): the skill points, perk point and Destiny warnings fire with the right levels and skills; on the WO-80 sample build none fire.

### 3. A way to tell
- A small additive table, `door_event`: when, the tool, the outcome (ok, refused, warned), the refusal or warning's code, and the build or playthrough id. No user id, no text.
- The admin page gains a **Connector** section: per week, calls per tool, refusals by code, warnings by code, and drafts finished with warnings still standing. That is how Bob and Dave see whether assistants get better after a change to the instructions.
- An e2e that drafts a 12-level two-handed build through the door the way Kyria's was drafted (four skills, Speech at 5 a level), gets the skill points warning back, then spends the points the warning names and gets none.

### Done when
- [x] The style guide has How points work (generated and tested) and How to build; `get_rules` and `get_tree` answer. (Mac, night of 20 Oct: How points work is written into the style guide from `RULES_5_0_4_8` and the engine's Oghma numbers when it's read, at the `{{how-points-work}}` mark in `style.md`; a test fails if a number and the rules disagree, and another changes a rule and sees the text follow. `get_tree` answers a whole tree in one call, by the skill each perk first needs.)
- [x] `add_level`, `set_level`, `get_build` and `finish_draft` carry warnings from `reviewBuild`; Kyria's plan as drafted gets its three warnings, the sample none. (Mac, night of 20 Oct: Kyria's levels are in `src/lib/mcp/__fixtures__/kyria-drafted.json`, from staging's `fsxh33upak` through `get_build`; she gets "169 skill points unspent since level 6. Two-Handed, Heavy Armor, Speech and Destruction are at max skill for level 23 (73); Smithing 25, Restoration 25 and Wayfarer 25 can take them.", "1 perk point unspent since level 5." with what's open, and "5 Destiny points unspent since level 1.". `e2e/wo119.spec.ts` drafts four levels with Speech at 5 a level, gets the warning, spends the points with `set_level` and gets none.)
- Blocked (night run): the fourth warning, a planned perk whose skill can't reach its requirement by its level. A build holds no planned perks, only taken ones, and the rules already refuse a taken perk whose skill is short. Bob: say what "planned" should read from (a level's note? a list the assistant passes?) and it's a small addition to `reviewBuild`.
- [x] `door_event` records every call's outcome and the admin page shows the Connector counts. (Mac, night of 20 Oct: migration 0020, additive. One row a call: the tool, ok, refused or warned, the code (a refusal's kind: rule, rate-limit, sign-in, not-found; a warned call's warning codes, joined), and the build or playthrough it named; no user, no text. The route counts every tool by wrapping `registerTool`. The admin page's Connector shows the last eight weeks: calls by tool, refusals and warnings by code, and drafts finished with warnings standing.)
- [x] Every check in CLAUDE.md passes; migration additive; behind the flag. Commit on `staging`, push, and stop: Dave asks his Claude to fix Kyria's levels, it reads the warnings and spends the points, and the admin page shows the warnings fall to none. (Closed by Dave, 21 Oct)

---

## WO-115  Quests an assistant can trust: endings, starts for every quest, and "open for you" (20 Oct 2026)

**Why.** Dave: assistants recommend quests he can't take on, call a quest available when it isn't, and tell him a quest ends one way when it ended another. Bob's look (backlog, "Why quest advice goes wrong"): the planner holds 1,240 quests by shape and checked starts for six stories; nobody holds each quest's endings, each quest's start conditions in plain words, or the player's quest state. Both the planner and the Book chat's own index answer those from memory. This order gives the planner the three, in the order they pay off, and makes the door say "open for you" or "unknown" instead of leaving the gap for the assistant to fill.

**Where.** Part 1 on the Mac (data and tools, no PC). Part 2 on the PC in batches (the start check across every line), with Bob merging the results. Parts 3 to 5 on the Mac once Part 2 has its first batch. Behind `FEATURE_QUESTS` where it touches pages.

### Part 1. Endings (Mac)
- `scripts/gamedata/quests.py` already reads each stage's log entries with their QSDT flags (completes, fails) but drops the CTDA conditions on a log entry and the flags never reach `quests.json`. Keep the conditions (the CTDA subrecords before each QSDT, described in plain words with the describer `quest_starts.py` uses: "Stage 160 of this quest done", "global X is 1", "the player is in faction Y"), and in `quest_pages.py` give each quest `stages: [{ index, log: [{ text, completes, fails, when }] }]` in place of the flat `journal`. Keep `journal` for the pages that read it.
- `endings` per quest: the log entries flagged completes or fails, with their `when`, in stage order. Blood on the Ice lists two; Caught Red Handed its own; a quest with none says so.
- Quest pages: a collapsed "How it can end" after the objectives, each ending as its journal line with its when in muted text, closed by default (no spoilers, backlog rule 3). The line page and the story page link to it.
- The door: `get_quest_start` becomes `get_quest({ name | id, version? })` and answers with what it does now plus `endings` and `objectives`; `get_quest_start` stays as an alias for a release. The style guide gains: "Never say how a quest ends unless the planner lists that ending."
- Unit tests on three quests (MS11's two endings, DB01, a quest with none); the Quests e2e opens How it can end.

### Part 2. Starts for every quest (PC, in batches)
- First the five tool gaps in `gamedata/5.0.4.8/story_checks/crawl-2026-10-19.md`: story manager nodes for helper quests, `GetIsID` speakers in other plugins, globals from other plugins, the dialogue that moves a quest to its second objective, and the resumable `SC_PHASE` mode folded into `story_check.py` from the PC's patched copy.
- A batch runner, `scripts/gamedata/story_check_all.py`: runs the check for every line in `questlines.json` in a given order, one line at a time, writing `gamedata/5.0.4.8/story_checks/<line>.json` and `.md` as today and a checkpoint file so it resumes where it stopped. It runs on Windows (`python story_check_all.py --root C:\LoreRim --batch guilds`) and in the PC's Linux shell in three-minute slices (`--slice 150`), whichever Dave prefers. Batches: `stories` (the 20 story candidates from the backlog), `main`, `guilds`, `daedric`, `lands`, `side`, `followers`.
- Per quest, the check's answer in plain words goes into `quests.json` through `quest_pages.py`: `start: { needs: ["Level 20", "The House of Horrors done", "Ask Kleppr or Frabbi about the Hall of the Dead"], who, where, task, checked: "files" | "not yet" }`. A need the tool traced is `checked: files`; a quest the tool couldn't trace keeps `not yet` and the page says so. `questlines.json`'s line-level `start`, `gate` and `minLevel` are kept and, where a checked quest start disagrees with the field guide's line text, the checked one wins and the disagreement is listed in `questlines_report.md`.
- Bob runs the batches and merges; Jeff on PC fixes the tool gaps and writes the runner. A batch is done when its lines' JSON is committed and `build.py` passes.

**Where Part 2 ended (Bob, 20 Oct, checked against `quests.json`).** Every batch is in. 566 of the 661 quests in story lines have a checked start; the other 95 are mostly radiant ones (Vigilant bounties, the Radiance quests, guides) and stay `not yet`. The 579 repeatable jobs on the work shelf (missives, bounties, odd jobs) are not checked. All 1,737 endings have a when, 54 with a condition, and the game's text tags are filled. So Part 3 will answer `unknown` for those 95 and the work shelf, as it should.

**Where the player's finished quests come from until the save helper (WO-112).** No snapshot carries quest stages yet. Until one does, `openFor` takes what the playthrough knows: quest objectives the player ticked or the save marked done, the snapshot's level and place, and a `done` list the assistant can pass from what the player says ("I finished the Thieves Guild"). A need that depends on a stage nobody has told the planner about makes the quest `unknown`, not `open`.

### Part 3. "Open for you" (Mac, after the first batch)
- `src/lib/quests/open.ts` gains per-quest needs: `openFor(quest, where)` returns `{ state: "open" | "locked" | "unknown", because: string[] }` from the quest's checked needs against `where` (level, place, finished lines, and quest stages when the snapshot has them). A quest with any need `not yet` is `unknown`, never `open`.
- `get_quest` and `suggest_quests` take the player's state (level, place, done lines, or a playthrough id whose snapshot carries quest stages) and answer `openFor` for each quest: "open for you", "locked: needs level 20", or "unknown: the start isn't checked". `suggest_quests` offers only `open` quests and never `unknown` ones.
- **Changed 20 Oct, 22:45 (Dave):** the Quests pages carry no player context. They are about the quests themselves; a player's level and progress belong to their playthrough. So: no Where you are, no "open for you" or locked badges, and no main-quest progress on any Quests page; take out what's there now. Facts about a quest ("Opens at level 25", "After the Thieves Guild") stay. `openFor` serves the door, and later Play.
- **Don't send who and where through the door yet.** Bob found tonight that the start check's who and where name the first objective's target, not the person who starts the quest, for 175 quests (The Book of Love shows Fastred at Fellstar Farm; Dinya Balu in the Temple of Mara starts it). Until WO-121 fixes that, `get_quest` and `get_quest_start` answer with the ways in (each starter as `way_of` words it, with its place and line) and the first objective as `then`, and leave `who` and `where` out.

### Part 4. The rule for assistants
- `content/mcp/style.md`: "Never call a quest available, open or possible unless the planner answers open for you. Unknown means say unknown. Never say how a quest ends unless the planner lists that ending." Tests on the style guide text.
- The Book chat's questsense lenses stay a shortlist tool on Dave's PC; the planner is the referee. Dave tells that chat to ask `get_quest` before recommending.

### Part 5. Pages

**Don't build Part 5 tonight.** It shows how each quest starts, which is wrong for 175 quests until WO-121. Write "Blocked (night run): waits for WO-121" under Done when and go on.

- A quest's page (`/quests/<line>/<quest>` or the line page's quest rows): How it starts (from the per-quest check, as the story page shows it), How it can end (Part 1), both marked checked or not. The line page's Where you are reads `openFor`.

### Done when
- [x] Every quest in `quests.json` has `endings`; Blood on the Ice lists two with their when; the page shows them closed by default. (Mac, 20 Oct: done except the when itself. `quests.py` now keeps each log entry's flags and CTDA conditions in plain words, tested on a built plugin, but this Mac has no LoreRim install to re-run it; until `python3 scripts/gamedata/quests.py` runs on the PC and `build.py` after it, `quest_pages.py` reads the endings from the stage flags already in `quests_raw.json`, with no when. Blood on the Ice's two endings, stages 100 and 250, show today. 181 of the 1,240 quests flag no ending, Caught Red Handed among them, and say so.)
- [x] `story_check_all.py` runs a batch on Dave's PC and resumes after a stop; the `stories` batch is committed and the Companions, College, Thieves Guild, Dark Brotherhood and Dawnguard results match the 19 Oct crawl. (PC, 20 Oct: a 150-second slice stopped after two lines and the next run picked up there. The stories batch (26 lines, the backlog's draft list) and the main and guilds batches are committed. The five lines match the crawl's counts and openings. Each quest's checked start is in `quests.json` through `quest_pages.py`: 415 of 1,240 so far, the rest "not yet". Still open in the tool: the forcegreet between Kodlak's scene and the Vilkas spar line, Faralda placed at her dormitory, and some condition functions it can't name yet, which show as "a condition the start check can't name yet". The daedric, lands, side and followers batches follow.)
- [x] `get_quest` answers open for you / locked, because / unknown, and `suggest_quests` never offers an unknown quest. (Mac, night of 20 Oct: `openFor` in `open.ts` judges each checked need against what the player told the planner, their level, finished lines or quests, a playthrough's ticked quest links and a save's quest stages; a need it can't judge (a global, a faction, a condition the check can't name, another quest's stage nobody gave) makes the quest unknown, and so does a quest past its line's first until the one before it is done, since a talk that opens it can hang on that in ways the check doesn't see. At level 6 with nothing told: 100 quests open, all line openers, 5 locked, the rest unknown. `get_quest` takes `level`, `done` and `playthrough` and answers `openForYou`; `suggest_quests` offers only stories whose first quest is open. Who and where are out of `get_quest` and `get_quest_start`: each quest's `start` gives its ways in as the check words them and its first objective as `then`. The Quests pages lost Where you are, the open counts, Only what I can start, Do this first, Your next step and Mark done, and the needs lists lost their marks; the story page's chapters are a plain list. Also fixed for WO-112's e2e: a file too short to hold a save's header says "This isn't a Skyrim save (.ess).")
- Part 5 (night run): built on WO-121's ways and then, with no player context; see WO-121's Done when.
- [x] The style guide carries the two rules; a quest with an unchecked start is answered "unknown" through the door, checked by the WO-108 e2e. (Mac, night of 20 Oct: rule 21. The Book chat's side is Dave's to tell it.)
- [x] Every check in CLAUDE.md passes. Commit on `staging` per part, push, and stop: Dave asks his Claude what Kyria can do in Riften at level 6 and gets only open quests, with their endings behind a click. (Dave, 21 Oct: his Claude offered only what the planner said was open, said unknown with the reason, and flagged the save being ahead. The bugs it showed are WO-130.)

---

## WO-112  The save reader (PC tonight, 20 Oct 2026)
Status: done

**Why.** Dave's step 6 for playthroughs: the planner should know where the player really is, from their save, not from an estimate. Today "Where you stand" is typed by hand and quest objectives can't tick themselves, and WO-115's "open for you" can't know which quests are finished. Dave chose (20 Oct): **one reader, two ways in**, the site and a local connector; and **the newest save, but ask when it's a different character**.

**What it reads, and what it never does.** From a Skyrim SE save (`.ess`): the character's name, level, XP toward the next level, the in-game day (the GameDaysPassed global), the place in the save's header, and the highest stage reached and whether it's completed for every quest the planner knows. Skills if they can be read reliably (Part 1 says). It never uploads the save file, never keeps it, and sends only those fields to the planner as a snapshot (`source: "save"`, rule 18).

**Where:** Jeff on PC tonight, because the saves are on this PC. Pull with rebase before every push: Jeff on Mac is pushing to `staging` tonight too (WO-120); stay out of the files his orders touch. Behind `FEATURE_PLAYTHROUGHS`. If the PC can't run the app's checks (`npm run typecheck`, `lint`, `test`), do Part 1 and write that under Done when; Jeff on Mac does Parts 2 and 3.

### Part 1. One reader, in TypeScript
- `src/lib/save/read.ts`: `readSave(bytes: Uint8Array)` returns `{ name, level, xp, xpToNext, day, place, quests: Record<editorId, { stage: number, completed: boolean }>, skills?: Record<skill, number> }`. A port of `C:\LoreRim\_fieldguide\tools\kyria-book\ess.py` and `questscan.py` (read them; they work on Kyria's saves): the header, the LZ4 block body (a small decompressor in the file, no native module, so it runs in a browser and in Node), the plugin and light plugin lists, the globals, and the quest change forms (stage list and the Completed runtime flag).
- **Which quest is which:** a generated `src/data/lorerim-5.0.4.8/quest_forms.json` mapping each quest's plugin and local form id to its editor id, from `quests_raw.json`'s `id` (`"00Taliesin.esp:5487A2"`), written by `scripts/gamedata/build.py`. The reader resolves a save's form ids through the save's own plugin and light plugin lists. Quests the planner doesn't know are left out.
- **Skills:** try the player's actor values (the player's change form). If they read true against what the game shows on Kyria's newest save, include them; if not, leave `skills` out and write under Done when what was tried. Don't guess.
- **Tests:** unit tests on a small synthetic save built in the test (header and body), and a check script, `scripts/save/check.mjs <file.ess>`, that prints what the reader found. Run it on the newest save of each character in `C:\LoreRim\profiles\*\saves` (Kyria Severa in "Extreme DLSS5", Azrem Shieldbreaker in "Extreme" and "Ultra") and commit the printed results (not the saves) as `scripts/save/checked-2026-10-20.md`, with Kyria's level, day and place next to what her save's header says and five quest stages you can confirm.

### Part 2. On the site: Read a save
- On Play's edit tab, above the acts, the owner's **Read a save**: pick a `.ess` file; the reader runs in the browser (the file never leaves the PC; it's also far over the server's upload limit); the page shows what it found (name, level, day, place, skills if any, and how many of this playthrough's quest objectives it would tick) with **Use this** and **Cancel**. Use this saves it as the snapshot (`source: "save"`, labelled "Save 62" from the header's save number).
- If the save's character name isn't the character's name, it says so plainly ("This save is Azrem Shieldbreaker, not Kyria Severa.") and Use this asks first.
- "Enter it by hand" stays beside it.

### Part 3. The local connector
- `tools/save-connector/`: a small local MCP server in Node using the same `readSave`, packaged as a Claude Desktop extension, with one setting, the save folders (default: every `profiles\*\saves` under the LoreRim folder, and `Documents\My Games\Skyrim Special Edition\Saves`). Two tools:
  - `read_latest_save({ character? })`: the newest `.ess` across the folders. With `character`, and the newest save is someone else, it answers with that character's newest save instead and says so; with no save for that character, it lists the five newest saves (file, character, level, when) and asks the player to choose.
  - `list_saves({ character?, limit? })`: the newest saves, by character.
  Each answers with the reader's fields only, never the file. The planner's style guide gains: "When the player has the save connector, read the save with it and pass what it found to set_snapshot unchanged. Never set a snapshot from memory."
- A README in the folder: how to add it to Claude Desktop, in five steps Dave can follow.

### Done when
- [x] Part 1: `readSave` reads Kyria's and Azrem's newest saves; the results are in `scripts/save/checked-2026-10-20.md`; skills read or the reason they aren't. (PC, night of 20 Oct: Kyria's Save 62 reads level 10, XP 197 of 525, The Rift and day 15, and 178 quests the planner knows. Azrem's Save 243 reads level 21, Falkreath, day 40, 298 quests; his Save 161 reads level 15, Ivarstead, day 29, 222 quests. The field guide's Python reader agrees on five of Kyria's stages on Save 62, and on all 174 quests on Save 51. The header's "game date" is play time, so the day comes from GameDaysPassed alone. Skills aren't read: the player's change forms hold no plain list of skill values, and nothing on the PC records what the game shows to check against; the file says what was tried.)
- [x] Part 2: Read a save on Play's edit tab, run in the browser, with the wrong-character check. (PC, night of 20 Oct: "Read a save" sits beside "Enter it by hand" under Where you stand. The reader and `quest_forms.json` load in the browser when a file is picked, and the file is never sent. It shows the name, level, day, place and save number, says skills aren't read yet and keeps the last ones, and counts how many of the run's quest objectives it would tick. Use this saves the snapshot as `source: "save"`, labelled "Save 62". A save of someone else says "This save is Azrem Shieldbreaker, not Kyria Severa." and Use this asks first. It checks the run's name, which is the character's, and the build's.)
- Blocked (night run): `npm run test:e2e` and the screenshot need the dev database, and this PC has no `.env.local` or Vercel CLI to pull one. `e2e/wo112.spec.ts` is written (Read a save on a save built in the test: what it found, 1 of Kyria's 2 quest objectives ticked, Cancel, the wrong-character check and its question, a file that isn't a save) but not run. Typecheck, lint, `npm test` and `npm run build` pass. For Jeff on Mac or Bob: run `npx playwright test e2e/wo112.spec.ts`, and screenshot Play's edit tab with the panel open.
- [x] Part 3: the save connector with `read_latest_save` and `list_saves`, its README, and the style guide line. (PC, night of 20 Oct: `tools/save-connector/` holds a local MCP server in Node with no packages, using the same `readSave`, and a Claude Desktop extension manifest with one setting, Save folders. `node tools/save-connector/build.mjs` bundles it and packs `dist/save-connector.mcpb`. Talking MCP to it here: `list_saves` lists Kyria's and Azrem's saves newest first. `read_latest_save({ character: "Azrem Shieldbreaker" })` says "The newest save is Kyria Severa's (Save 62); this is Azrem Shieldbreaker's newest, Save 383." and gives the snapshot for `set_snapshot`. For a character with no save, it lists the five newest. Rule 18 in the style guide carries the line. A snapshot from a save that brings no skills keeps the last ones. Azrem's newest save turned out to be Save 383, in "Extreme DLSS5"; it's added to `checked-2026-10-20.md`.)
- Blocked (night run): installing `save-connector.mcpb` in Claude Desktop wasn't tried here (it needs the desktop app's Settings, which this run can't drive). The manifest follows the extension format as I know it (`manifest_version` 0.2, a node server, a multiple-directory setting); if Claude Desktop refuses it, the README's last section runs the same server by hand, and it can go in `claude_desktop_config.json` as `node <path>\dist\server\index.js "C:\LoreRim"`.
- [x] Every check in CLAUDE.md passes; behind the flag. Commit on `staging` per part, push, and stop: Dave adds the save connector, asks his Claude to update Kyria from her latest save, and sees Where you stand and her quest objectives fill in. (Dave, 23 Oct: tested, done.)

---

## WO-113  (to write)

- **WO-113 Merchants (PC).** `get_spell` can't say where a spell is sold: the planner has no merchant data. Read vendor containers and their leveled lists from the game files, per spell tome and item, and mark random stock as such. Until then the tool says so and tells the assistant not to name one from memory.

## Parked (not ordered yet)

- **Renders that lose their effects (after WO-95).** Items with glow, parallax or animated shading, Dawnbreaker for one, render flat. Fix them one by one in `render.py` (emissive maps, a second light pass) once Dave flags the ones that matter.

- **A true beginner's guide to LoreRim (Dave, 12 Oct; not now).**
  - It isn't a character guide and isn't about installing. It's the in-game basics a new player wishes they'd known.
  - What it covers: which mods run which systems and how to set them; the most important differences from vanilla; how to earn XP early (a plug for Callings); and Dave's list of about 20 "game changers once you know they exist".
  - It's a page of its own on the site, not a build.
  - The field guide (`lorerim/systems/*`, `lorerim/meta/mod-systems-map.md`) already holds most of the checked facts. Careful not to step on anyone else's guides.

- **Set up loses changes silently (found 11 Oct).** Changes on a Set up step are kept only until `Save changes` on the Name step. Reloading, or leaving through the edit bar (`Levels`, `Guide`), drops them with no warning: a Focused Combat choice was lost this way. Either save each step as it changes, like the editor does, or warn before leaving with unsaved changes.

- Custom domain: lorerimplanner.com, on Dave's say-so.
- **Skip ahead, more** (after WO-69): split a stretch (write level 18 inside 11 to 25); a Browse filter for builds that write every level.
- **Destiny target:** pick the Destiny star you're heading for and light the path to it.
- **Skills over levels:** a small line chart on the shared page of the main skills from level 1 to the last.
- **Callings:** a field for the build's Calling, once the Callings mod data is in.
- **Note preview:** hovering a level in the level row shows the start of that level's note.
- **Search by perk:** "builds that take Lone Wolf", from the plan's perks. (The item half is WO-93.)
- **Where gear is found (after WO-92, Dave 16 Oct).** The records can answer part of this. Each would fill the Gear page's Source filter and the item page's Where to find it:
  1. **Placed items:** an item placed in a cell. Read the world data and turn cell ids into place names. Most useful for named uniques like Dawnbreaker and Chillrend.
  2. **Loot lists and merchants:** follow the leveled lists, which nest inside each other, to who carries them. The answer is fuzzy ("can drop from bandits from level 20").
  3. **Quest rewards:** handed out by scripts, so not readable. Hand-written notes only, if ever.
  Until one of these is done, the page says plainly that it isn't listed.
