# Work orders

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
- [ ] Safari, which wasn't checked: Dave looks at the intro's drop cap in Safari on the Mac.
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
- [ ] e2e: open the account menu, the Tags filter and `Other trees`; a click outside each closes it, and Esc closes it and returns focus.
- [ ] Screenshots of the footer at 1440 and 390 on the home page and a build page. The Discord link opens `https://discord.gg/bungalo`.
- [ ] Unit test: `tips.json` has the 14 tips above, word for word.
- [ ] Screenshots of the drop cap with `I`, `W` and `A`, in Ember and Parchment.
- [ ] A short GIF of a card's hover, and of the logo's glint.
- [ ] All checks in CLAUDE.md pass.

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
- [ ] Unit tests: the YouTube link forms above give the right id; a Vimeo link and plain text are refused.
- [ ] e2e: add a video to Iriel. The hero shows `Watch the video guide`; clicking it opens the Guide tab with the player; no request goes to youtube.com before the click.
- [ ] e2e: as an admin (a test id), feature Iriel. Browse shows her first and two columns wide; a non-admin doesn't see the menu item.
- [ ] Screenshots: Browse at 1440 and 390 with Iriel featured and a video; Iriel's Guide tab with the video at the top.
- [ ] All checks in CLAUDE.md pass.

---

## WO-40  Safety: image checks, reports, and bot limits (12 Oct 2026)

Dave's call, 12 Oct: use Sightengine's free plan (2,000 images a month, at most 500 a day), and tune it so LoreRim's weapons, gore and near-nudity pass while porn doesn't. Do after WO-39.

**Waiting on Dave for one thing.** He signs up at sightengine.com and adds the keys in Vercel as `SIGHTENGINE_API_USER` and `SIGHTENGINE_API_SECRET`, for Production and Preview. Build and test everything with the API mocked; don't wait for the keys.

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
- [ ] Unit tests with the check mocked:
  - `sexual_display` 0.9 is refused;
  - `erotica` 0.9 is stored and listed;
  - `mildly_suggestive` 0.95 is stored and not listed;
  - a timeout is stored as `not checked`.
- [ ] Unit test: the only model requested is `nudity-2.1`.
- [ ] e2e: three different test accounts report a build; its cover hides; an admin presses `Keep` on `/admin/review`; the cover is back.
- [ ] e2e: the 11th build in a day is refused with the message. An account 2 days old can't set Listed.
- [ ] A note for Dave in the commit on Vercel BotID: on or not, and what it needs.
- [ ] All checks in CLAUDE.md pass.

---

## Parked (not ordered yet)

- **A true beginner's guide to LoreRim (Dave, 12 Oct; not now).**
  - It isn't a character guide and isn't about installing. It's the in-game basics a new player wishes they'd known.
  - What it covers: which mods run which systems and how to set them; the most important differences from vanilla; how to earn XP early (a plug for Callings); and Dave's list of about 20 "game changers once you know they exist".
  - It's a page of its own on the site, not a build.
  - The field guide (`lorerim/systems/*`, `lorerim/meta/mod-systems-map.md`) already holds most of the checked facts. Careful not to step on anyone else's guides.

- **Set up loses changes silently (found 11 Oct).** Changes on a Set up step are kept only until `Save changes` on the Name step. Reloading, or leaving through the edit bar (`Levels`, `Guide`), drops them with no warning: a Focused Combat choice was lost this way. Either save each step as it changes, like the editor does, or warn before leaving with unsaved changes.

- Custom domain: lorerimplanner.com, on Dave's say-so.
- **More gear slots (pinned: Dave checks in game later on 12 Oct, then we pick the slots).** The chat session read LoreRim's game files, and 451 wearable pieces use body slots the planner doesn't know. The item index drops them all today. They sort into these groups:
  - cloaks and capes: about 270 pieces, on slots 40, 45, 46 and 57;
  - backpacks and bags: 67, on slot 47;
  - scarves, collars and sashes: on slots 45 and 46;
  - masks and eyewear: on slots 43 and 44;
  - padding, mail and plates under-layers: 27, on slot 56;
  - small extras: armlets, bracelets, beacons and flasks.

  Wedding bands (slot 51) are rings. Body-physics objects and `$TNG_` records are junk to skip. Mods put the same kind of item on different slots, so sort by name as well as slot.

  **Where the in-game "Type" comes from** (checked 11 Oct, late). The game has no gear slots, only each item's Type, and two mods set it at load time:
  - Object Categorization Framework tags items with keywords through Keyword Item Distributor ini files, e.g. `OCF_BodyTypeScarf`, `OCF_AccessoryBag_Backpack`.
  - Inventory Injector rules turn those keywords, plus body slots, into the Type label. LoreRim's main rule file is Aura's Inventory Tweaks' `AIT.json`; there are 142 rule files in all.

  So the full list of Types is in the files: `AIT_english.txt` has Cloak, Backpack, Scarf, Accessory, Face, Belt, Mantle, Pauldron and more.

  Working out each item's Type means doing what Keyword Item Distributor does, since the keywords aren't in the plugins. A first pass that read only the plugins gave wrong answers (robes as Cloak, no scarves). The planner's slots should be a short list picked from these Types; Dave picks which in game.
- **Repeat last level** (from the three builds): a button that spends this level's skill points like the last one, as far as the rules allow. Most of levels 10 to 20 were the same spread.
- **Perk wishlist:** list the perks you want in order and let the planner place each at the first level it can be taken.
- **Destiny target:** pick the Destiny star you're heading for and light the path to it.
- **Skills over levels:** a small line chart on the shared page of the main skills from level 1 to the last.
- **Callings:** a field for the build's Calling, once the Callings mod data is in.
- **Note preview:** hovering a level in the level row shows the start of that level's note.
- **Search by perk or item:** "builds that take Lone Wolf", "builds that use a Glass Light Bow", from the plan's perks and gear item ids.
