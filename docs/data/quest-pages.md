# What a quest page and a quest line page show

Written 23 Oct 2026 after Dave called the pages a shit show. Every field here comes from the quest reads (`gamedata/5.0.4.8/quest_reads/`, see WO-153), and the connector's `get_quest` returns the same fields in the same order. A player's Claude and a player's eyes get the same answer.

The rule for every line on a page: a player reading it can act on it. If they can't, it doesn't go on the page.

## A quest page

In this order, top to bottom.

1. **Name, the line it belongs to, the mod it comes from.** Once. No repeated title.
2. **Can I do it?** One line, one of:
   - "Talk to someone to start it" (the normal case)
   - "Starts by itself when …" (the trigger in words: "when you're banned from the Guild")
   - "Repeats: a radiant job" (bounties, contracts that come again)
   - "Cut from the game: only the console starts it"
   - "Not a quest you'll see: it runs in the background"
3. **What you need first.** Level, an earlier quest, a faction, an item. Or "Nothing: any level". Each one a link if it's a quest.
4. **How to start it.** Who, where you find them, what you do, in one or two sentences a player can follow. Several ways: each one on its own line. Where a person is found comes from the people data (by day, by night) once WO-155 lands; until then it says where the game places them and says so.
5. **Where it takes you.** The places, in order, with their hold and how dangerous they are (from the places index: "bandits from level 6, the chief 18 to 24").
6. **Choices that matter.** In plain words: "Help Jaree-Ra or turn him in. Helping him gets you the Icerunner's loot; turning him in gets the guard captain's reward." No stage numbers, ever.
7. **What you get.** XP (from the quest's type and LoreRim's Experience.ini), gold, items, a follower, a house, a title, a spell. Each with when you get it if it depends on a choice.
8. **What it opens and what it closes.** The quests it leads to; anything it locks (a side in the war, a guild, a person who dies).
9. **The steps.** The journal objectives, grouped by branch when the quest branches, not one flat list of every stage.
10. **How sure we are.** One line at the bottom: "Read from the game files and checked by a second reader", "Checked in game by Dave, 23 Oct", or "Unsure: where Vingalmo stands". The "This was wrong" link sits here.

Never on the page: stage numbers, record ids, "game files" tags on every line, the condition text a script wrote, a quest line made of one quest.

## A quest line page

1. **What it is.** Two sentences: what kind of story, where it happens, what level it's made for, roughly how long.
2. **How to get in.** The first quest's start and what it needs (LoreRim's level gates included: "Dawnguard waits for level 30").
3. **The quests in order.** One line each: what it is, where it takes you, how dangerous, and what it needs that the one before didn't. Branch points shown where you pick a side.
4. **What the whole line gives you.** The big rewards: titles, houses, followers, powers, artifacts.
5. **What it closes.** Sides you can't take after, people who die, lines that conflict.
6. **How sure we are**, as on a quest page.

## Jobs and errands (boards, bounties, favours)

Not a story, so not shown as one. No "The story" heading. Grouped by where you pick them up (a town, a board, a jarl), each with who or what gives it and what it pays. A standalone quest sits in its category; it never gets a quest line of its own.

## What Claude gets through the connector

`get_quest` returns sections 2 to 10 as fields, in this order, with the "how sure" line on each field that isn't checked. `suggest_quests` returns 2, 3, 4 and 7 for each result, so a plan never shows `start: null`.

## Dave's answers, 23 Oct 2026, 19:44 (not built yet; everything is paused)

**How sure we are: a confidence line, with what it rests on.** Each quest (and each field that differs) shows a confidence and the sources behind it:
- **LoreRim's game files**, read by an agent and checked by a second one.
- **Other sites**: UESP and similar, where they agree or fill a gap (marked when a fact comes only from them).
- **Community input**: what signed-in players have reported and an admin approved (WO-146).
- **Checked in game**: a player watched it happen (Dave's Jaree-Ra, Running Wild's board).
- **Confirmed by players**: a "I can confirm this quest is accurate" button for signed-in (Discord) users; a modal says it's recorded; the page shows how many people confirmed and their names.

The confidence comes from those, in plain words, not a percentage: *checked in game*; *game files, checked, agrees with UESP*; *game files only*; *not confirmed: which ending gives the book*. A field a player confirmed in game drops the read's doubt about it.

**Every NPC named anywhere links to their page.** On quest pages, line pages, the connector's answers, everywhere. Needs the people pages (WO-155).

**Still to settle:** where a person's hours go (beside their name, or a "When" line), and how the jobs pages are grouped.
