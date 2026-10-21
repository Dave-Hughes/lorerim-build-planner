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

## Pixel icons

The skill icons (approved 10 Oct 2026, second pass) are the bar for every icon set that follows. They are drawn in `scripts/icons/pixels.py`, never by hand-editing SVGs, and follow these rules:

- 16×16, shown at 16 px (or an exact multiple), `image-rendering: pixelated`.
- A 1 px near-black outline (#06080b) around every shape, added by the script, so all icons share one edge. Thin details (a bow string, sparks) skip the outline.
- Light from the top left: a highlight on the upper and left parts, a shadow lower and right. Three tones per material plus the outline.
- The silhouette fills most of the 14×14 inside the outline and reads at 16 px on both the dark ground and an ember (selected) background.
- The planner's palette only: steel, brass/wood, ember/fire, magicka blue, health red, stamina green.
- One clear object per icon, the one a player would name ("a bow", "a skull"), never an abstract symbol or a letter.
- Decorative only: the name always sits beside the icon.

## Guide pages

The guide teaches the game in the order a player meets it: chapters, then sections. A question goes under the section that explains its subject; nobody asks about F1 to F4 before they know stances exist. These rules come from Dave's review of the first chapter mockup (13 Oct 2026).

17. **No AI-sounding copy, anywhere.** Plain sentences that state a fact or an instruction. No punchy one-liners, no "X, not Y" framing, no lists of three adjectives, no promises ("learn these five things and..."), no headings that try to be clever ("Stamina runs the fight" became "Stamina").
18. **Subtitles state a point, plainly.** A chapter may have a subtitle that says what it covers. No flavour lines or in-world quips.
19. **No stat cards** unless the information can't be shown as a sentence, list or table.
20. **Each section:** a plain explanation, then a collapsed **More detail** (numbers, edge cases), then a collapsed **Related Mods** (each mod's name, what it does here, where its settings file is, and whether changing it is allowed), then **Players ask** (questions with answers, collapsed).
21. **Only checked facts.** Every number comes from the installed 5.0.4.8 files or the official site, as the FAQ content does. Use the game's own terms (poise, not balance).

## Tapps and the app's own words

22. **Tapps speaks plainly (Dave, 14 Oct 2026).** The tour, empty states, tips and messages say what a thing is or what to do, in short sentences. No jokes, asides or bits ("Then mead.", "Tapps likes arrows."). Tapps keeps his name and portrait; his lines read like the rest of the app.

## Playthroughs

A playthrough is a character's whole run: acts, objectives, and the tale written alongside (WO-111, 19 Oct 2026). These rules are the same as rules 12 to 18 of the assistants' style guide (`content/mcp/style.md`), numbered here after the rules above.

23. Two kinds of text, kept apart. **Tale** is the story: what the character sees, wants and does, as a story, with no numbers or instructions in it. **Play** is the game: what the player does, where, with which quest or item, in plain instructions. A chapter is Tale only. An act's goal, an objective and its why line are Play only.
24. An act is a stretch of the game with a goal and a place: a name, a level range, a place, the goal in one line ("Earn a bed and coin in Riften as a bard and a worker"), and, if there is one, a standing rule for what the player keeps doing through the act ("Play the Bee and Barb most nights"). A standing rule is not an objective.
25. An objective is one thing the player can know is done. Either **done once** (a quest or one of its stages, a person met, a place reached, an item in hand, one act they will tick: "Sing for the children at Honorhall") or **reach a number** (a level, a skill at a number, a count the save or the player can give: "Read 10 books"). "Read every new book", "keep playing", anything with every, each, always or whenever, is a standing rule, and the planner refuses it as an objective. Each objective has one why line.
26. An objective links to a planner quest, quest line, spell, item or follower when one exists; the rest is the player's own words. Never invent a quest. Quest facts in a why line come from the planner (the checked start, the giver, the place) and say "not checked yet" when the planner does.
27. The story is made of chapters. A chapter sits in the Prologue or in an act; any chapter can unlock when an objective is done. The first chapter of an act opens its card on Play. Assistants can't add pictures. When you finish a draft, give the player the addPictures link so they can add the cover and the story's pictures.
28. Suggestions are proposals: an assistant's suggested objective shows as suggested with Accept and Skip, and nothing counts until the player accepts it.
29. Where you stand (level, day, place, skills) comes from the player's save through the helper, or from the player by hand. Never from an estimate.

## Visual system

- Ground #0e1319, panels #141b23, rules #2a3442, text #e4ebf0, muted #8e9bab.
- Accent: ember orange #f0913f (buttons, selected level, taken perks, chosen traits, links). Dark text #0e1319 on it.
- Brass #b9a173 only for ornament: section labels and the small corner marks on key panels.
- Attribute colors: Health #d07a6a, Magicka #7d9fd6, Stamina #86b47f. Green/red also mark a trait's benefit/cost.
- Type: Sofia Sans Extra Condensed (uppercase, tracked) for titles and labels; Sofia Sans for body; Alegreya italic only for flavor text (build description, author quotes, perk descriptions). The Story tab (WO-79) is the one place Alegreya sets body text, upright at 20px on a 680px column in a warm off-white (#ddd5c6) on #0b0f14, since a story is flavor text. A perk's bracketed effect summary from the game ("[20% more melee damage]") is set in plain body text under the italic flavor line.
- The pixel face, Jersey 10, appears in two places only. On the coming soon page it sets the hero title (`LoreRim` / `Build Planner`, mixed case) and `Opening soon`, so the words sit in the pixel art; the site's link-preview card uses it for its title too. In the app, the Aurora guide theme (WO-89) sets one thing in it: the build's title in the hero, mixed case with a hard shadow. Everything else on an Aurora page keeps the site's fonts.
- Square corners, thin rules, no shadows or glows, no gradients except the functional fade over images, no emoji.
- Perk trees are drawn as constellations growing upward from the first perk: filled star = taken, ring = can take now, small dim dot = not yet. Crowded rows (One-Handed, Destruction) stagger their stars up to three deep so names never touch and every tree fits its box without scrolling. A perk that rules out another ("Not with Block: Weapons Master") says so under its name, like a prerequisite from another tree.
