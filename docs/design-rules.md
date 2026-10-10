# LoreRim Build Planner — design rules

Source of truth for the look and behavior: the design canvas **LoreRim Build Planner Screens** (shared build, creation, level-up), https://claude.ai/artifact/48H6v9Q6wFuwhzRqE31uD1. Spec: https://claude.ai/code/artifact/3225b318-c21e-4990-b138-32bfd322ee1c.

These rules come from Dave's review of those screens (9 Oct 2026). The LoreRim community is quick to call out anything that looks AI-made, so every screen has to read as hand-built for this game.

## Copy

1. **No micro labels above titles.** No small uppercase "eyebrow" line above a page or section title ("Build · Rules from…", "Step 4 of 5"). If the information matters, put it somewhere it earns its place (a byline, a step list).
2. **No middle-dot dividers.** Never join items with " · ". Give each item its own styling, put items on separate lines, use a tag, or use a plain pipe `|` or hyphen `-` (never an em dash).
3. **No how-it-works copy.** People using a build planner know how one works. No intro paragraphs explaining a step, no hints like "click a skill to jump to its tree".
4. **Extra detail goes in a tooltip.** When a value needs explaining (the skill limit, for example), add a small "i" after it with the explanation on hover or tap. Keep the visible text short.
5. **Use the game's words.** Don't coin terms ("capstone" became "Skill 100 perk"; "cap" became "max skill"). If players wouldn't say it, don't print it. Perk and trait descriptions are the game's own text, read from the records (10 Oct 2026), including the game's rank format "(1/3)" and its names (Destiny's "Endurance", not the wiki's "Acrobat").
6. **Short verb buttons.** "Confirm", "Choose", "Remove", "Copy link".
7. **Placeholders say what goes there**, in square brackets: [Discord name], [Perk description from the game files].

## Content

8. **Say each thing once per screen.** If the tree already shows a perk's prerequisite or skill requirement, the detail panel doesn't repeat it. If the top summary row shows points left, section headings don't.
9. **Show the exception, not the default.** Most perks cost 1 point, so the cost line only appears when it's different (a Smithing book, ingredients to carry, quest progress). (Death's Emperor was thought to need a coin; the records say the perk puts the coin in your bag, so it has no cost line.)
10. **No invented groupings.** Don't sort game data into categories we made up (trait "Combat/Magic/Stealth" filters were removed). Search plus A to Z is enough.
11. **Fewer steps.** Pick straight from a list. No separate slots to fill first (traits: chosen ones pin to the top of the list, "1 of 2 chosen").

## Layout and controls

12. **Build page leads with the author's cover image**, full width, with the build name, description, byline and actions over its lower edge on a dark fade. No image: plain dark band.
13. **Level stepping:** ‹ › buttons sit on the left, either side of "Viewing level N of M". The whole-build ruler (marks only for Destiny picks, stone changes and Skill 100 perks) sits above a 12-level detail row.
14. **Legends sit with what they explain** (the star key sits under the perk tree, not in the detail panel).
15. **Selected states must be unmistakable.** Attribute choice = three cards in the attribute's own color; the chosen one gets a thick colored border, a filled round marker and the new value with "+5".
16. **Trait cards use the trait's in-game artwork** as the card background, fading to dark under the text. If an author objects, remove it. (Done: `public/traits/*.webp`, converted from the Biggie Traits / LoreRim Traits thumbnail DDS files; the numbers the game highlights in a trait's text are set in a brighter weight.)

## Visual system

- Ground #0e1319, panels #141b23, rules #2a3442, text #e4ebf0, muted #8e9bab.
- Accent: ember orange #f0913f (buttons, selected level, taken perks, chosen traits, links). Dark text #0e1319 on it.
- Brass #b9a173 only for ornament: section labels and the small corner marks on key panels.
- Attribute colors: Health #d07a6a, Magicka #7d9fd6, Stamina #86b47f. Green/red also mark a trait's benefit/cost.
- Type: Sofia Sans Extra Condensed (uppercase, tracked) for titles and labels; Sofia Sans for body; Alegreya italic only for flavor text (build description, author quotes, perk descriptions). A perk's bracketed effect summary from the game ("[20% more melee damage]") is set in plain body text under the italic flavor line.
- Square corners, thin rules, no shadows or glows, no gradients except the functional fade over images, no emoji.
- Perk trees are drawn as constellations growing upward from the first perk: filled star = taken, ring = can take now, small dim dot = not yet. Crowded rows (One-Handed, Destruction) stagger their stars up to three deep so names never touch and every tree fits its box without scrolling. A perk that rules out another ("Not with Block: Weapons Master") says so under its name, like a prerequisite from another tree.
