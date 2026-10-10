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
- [ ] Unit test for line state: held→held, held→open and other, including a star with 1 of 2 ranks counting as held, and an "either of" line.
- [ ] Destruction at 1440 with Novice taken and Electromancy 1/2: screenshot before and after, side by side, for Dave; plus One-Handed and Restoration with a longer path (four or more held perks) at 1920 and 2560.
- [ ] Greyscale screenshot of the same tree showing all four star states told apart.
- [ ] Tabs show held counts in the editor and on the shared build page.
- [ ] All checks in CLAUDE.md pass.

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
- [ ] `birthsigns.json` is generated (no hand edits), and no birthsign text contains words that aren't in the records; diff of old and new texts for Dave.
- [ ] Screenshots for Dave: shared example build at 1920 (guide, At level, gear), race and birthsign steps at 1440 with a chosen card, editor at 1456 with a star selected, and at 390 the header, level row and tree tabs.
- [ ] e2e: on 390, the tree tabs are one row and the selected tab is in view; in the editor at 1456, selecting a star shows its name in the pinned panel without scrolling.
- [ ] All checks in CLAUDE.md pass.

---

## Parked (not ordered yet)

- Custom domain: lorerimplanner.com, on Dave's say-so.
