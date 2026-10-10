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
- [ ] Every button in the app goes through the shared classes or matches them exactly; no stray default-styled buttons (search `<button` and check each one).
- [ ] Nothing rounded, no shadows, glows or gradients added; chamfer is the only new shape.
- [ ] `npm run build`, `npm run test:e2e` pass (button names unchanged, so tests should not need edits).
- [ ] Before/after screenshots of: the home page, the race step, the traits step, the editor (perk panel with Confirm visible), the shared build page, at 1440 and 390 wide, for Dave to judge.

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
- [ ] The two tiles update as skills are set and un-set; they stay visible when the Mage group is scrolled into view at 1440×900.
- [ ] At 390 wide the tiles sit side by side without wrapping their numbers and the row below them is not hidden.
- [ ] `e2e/create.spec.ts` still passes (it asserts the sidebar summary `3 of 3 majors (+10), 2 of 6 minors (+5)`; update that assertion if the summary wording changes, otherwise leave it).
- [ ] Screenshots at 1440 and 390 wide.

---

## Parked (not ordered yet)

- Pixel icons for the skill trees: on `staging` for Dave to judge. See `docs/backlog.md`.
- Custom domain: lorerimplanner.com, on Dave's say-so.
