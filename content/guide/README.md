# Guide content

One file per chapter, named `NN-slug.md` (`05-fighting.md`). The page is built from these files alone.

## Front matter

```
---
chapter: 5
title: Fighting
subtitle: How combat works in LoreRim, and what is different from Skyrim without mods.
icon: chapter-fighting
---
```

`subtitle` is optional. `icon` is a file name in `public/icons`, without `.svg`. After the front matter comes the chapter's lead: one or two plain paragraphs.

## Sections

Each `## Heading {#id}` starts a section. The `{#id}` is the section's anchor and must stay the same once published, because players share links to it.

Inside a section, in this order:

1. The explanation: ordinary markdown (paragraphs, lists, tables, `**bold**`, `` `code` ``). Keys are written as `[[F1]]` and shown as key caps.
2. At most one `:::more` block, shown collapsed as **More detail**.
3. At most one `:::mods` block, shown collapsed as **Related Mods**.
4. Any number of `:::ask` blocks, shown under **Players ask**, each collapsed to its question.

```
:::more
- Bandit levels: 3 (29%), 7 (26%) ...
:::

:::mods
- **Requiem**: Fixed enemy levels, armor and resistances.
- **TK Dodge RE**: The dodge and its stamina cost.
  - where: `SKSE/Plugins/tk-dodge.toml` in LoreRim - MCM and INI Settings
  - tag: Key can be changed
:::

:::ask{q="Left Alt does nothing"}
You don't have the Dodge perk yet. Raise Evasion to 25, take Agility, then take Dodge.
:::
```

In `:::mods`, each top-level item is one mod: its name in bold, a colon, then what it does here. Optional sub-items: `where:` (the settings file or MO2 option), `tag:` (shown as a small label) and `nexus:` (the mod's Nexus Mods id; the name then links to `https://www.nexusmods.com/skyrimspecialedition/mods/<id>`). Only use an id read from the installed mod's `meta.ini`. LoreRim's own mods get `tag: LoreRim's own mod` instead.

## Terms

`terms.md` holds every word the guide explains in a tooltip: `## Term {#id}`, optional `- aka:`, `- icon:`, `- nexus:` and `- see:` lines, then one or two plain sentences.

In a chapter, `{{MO2}}` marks a term: the text is shown as written, with the term's icon in front if it has one, and the tooltip shows its definition. The text must match the term's heading or one of its `aka` names (case doesn't matter). For other wording, give the id: `{{Armor spells|flesh-spell}}`.

Mark a term the first time it appears in a chapter, and wherever a table lists it (races, birthsigns, needs). Don't mark it again in running text.

## Links between chapters

`[Stamina](/guide/fighting#stamina)` links to a section. Use the chapter's slug and the section's id.

## Writing rules

`docs/design-rules.md`, "Guide pages". Every fact is checked against the LoreRim 5.0.4.8 files or the official site before it goes in.
