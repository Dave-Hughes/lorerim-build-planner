# The player's questions

The test nothing counts as done without (WO-135). Each question is asked as a player types it to their assistant. Under
it: the tools an assistant would call, and what the answer must hold and must never hold. `src/lib/mcp/player-questions.test.ts`
runs each one through the door's own handlers on the real data and checks the answer; `npm run test:questions` prints
every question with pass or fail and what it got.

Every answer, on top of its own list, must never hold: an editor id (`MyrwatchTNE_Quest`, `ccBGSSSE002_...`), a form id
(`Skyrim.esm:0DC9E0`), a raw condition function (`GetIsRace`, `fn629`) or "someone the records don't name" or "someone the line doesn't name". The record
form an assistant reasons on (`raw`) and the ids it passes back (`edid`, `id`) aren't read for these.

A question that fails today stays in, marked with the order that fixes it, so the list of what doesn't work is in the
repo and shrinks. When Dave finds a question that fails, Bob adds it here before the fix is written.

## Finding a quest

**1. "In LoreRim, how do I start the quest called Palonimo?"**
- Calls: `search_facts("Palonimo")`, then `get_quest` on what it finds.
- Must: finds Running Wild; says to read the note; says where the note is (the board outside Joslin's house, behind the Bannered Mare).
- Passes since WO-133 (search) and WO-131 Part 0 (the note's place).

**2. "How do I start Running Wild?"**
- Calls: `get_quest({ name: "Running Wild" })`.
- Must: the note, where it is (outside Joslin's house, the Bannered Mare), and that the place is from a player; its first step, catching the white horse.
- Passes since WO-131 Part 0.

## Dave's quests

**3. "How do I start Blood on the Ice?"**
- Calls: `get_quest({ name: "Blood on the Ice" })` (two quests have the name: the planner asks for the EDID, MS11).
- Must: it starts by itself at night in Windhelm after you've come in four times, or a Windhelm guard; then "Question the witnesses".
- Fails today: **WO-154** (Bob's word): Blood on the Ice is read now. Its read says it starts by itself in Windhelm (witnesses over a body) with a second way through the steward; no four visits at night, no guard.

**4. "How do I start Caught Red Handed?"**
- Calls: `get_quest({ name: "Caught Red Handed" })`.
- Must: Svana Far-Shield, Haelga's Bunkhouse, and that a condition isn't named yet; then "Obtain a Mark of Dibella from Bolli".

**5. "How do I start The Blessings of Nature?"**
- Calls: `get_quest({ name: "The Blessings of Nature" })`.
- Must: Danica Pure-Spring, Temple of Kynareth, Whiterun; then "Retrieve Nettlebane". Never "Inspect the Temple of Kynareth" as the first step.
- Fails today: **WO-154** (Bob's word): The Blessings of Nature is read now, and its read gives the first step as Inspect the Temple of Kynareth, which WO-138's ruling dropped for Retrieve Nettlebane.

## Where things are

**6. "Where do I find the book for Running Wild?"**
- Calls: `get_quest({ name: "Running Wild" })`.
- Must: a place for The Palonimo Mare, or "isn't checked yet". Never a guess.
- Passes since WO-131 Part 0.

**7. "Where do I find the book for …?", for every other read-this start (61 ways today: the Dark Brotherhood's extra contracts, Boethiah's Calling, Deathbrand, Lost to the Ages, Wyrmstooth's notes and the rest).**
- Calls: `get_quest({ id: <its EDID> })`.
- Must: each read-this way has its place (`whereIs`), or says where to find it isn't checked yet (`whereIsIt`).
- Passes since WO-131 Part 2.

## The player's own game

**8. "What quests are in my quest log?"**
- Calls: `get_quest_log({ playthrough })` on a stored save (in the test: Running Wild at 10, Blood on the Ice at 100, an unnamed helper at 20).
- Must: Running Wild under way, at "Catch the white, or palonimo, horse"; Blood on the Ice finished, with its ending; the helper counted, never named.
- Passes since WO-134. The test reads `questLog` on the snapshot, what `get_quest_log` returns for a playthrough that stores it (the tool itself needs a signed-in playthrough).

**9. "What can Kyria do at level 6 in Riften?"**
- Calls: `suggest_quests({ level: 6, where: "Riften" })`, and `get_quest({ name: "Caught Red Handed", level: 6 })`.
- Must: only quests open for her, in Riften; Caught Red Handed with its unnamed condition said ("unknown"). Never Join the Dark Brotherhood (it starts in Windhelm).

**10. "What do I need for Bleak Falls Barrow at level 5?"**
- Calls: `get_quest({ name: "Bleak Falls Barrow", level: 5 })`.
- Must: its needs (Farengar and the Dragonstone, or after Before the Storm), and open, locked or unknown with the reason.

**11. "What quests are near me?" (in Whiterun)**
- Calls: `suggest_quests({ level: 10, where: "Whiterun" })`.
- Must: only stories that start in Whiterun. Never the Thieves Guild (Riften) or the Dark Brotherhood (Windhelm).

## Found failing in Dave's final test (22 Oct, 14:19)

**12. "How do I start Deathbrand?"**
- Calls: `get_quest({ name: "Deathbrand", level: 10 })`.
- Must: the level gate on "It starts by itself when you level up" (the story node needs level 20, a global that reads 20 now; the page dropped it). Geldis Sadri's talk is shown with its condition, or not at all as a way in: the record has it only when "Deathbrand stage 20 done" and stage <= 1 (a mod's edit), so it is not "the easiest one to aim for". The book's places: the first few named, and a way to see all 14, never "and 11 more places" with no way to ask.
- Passes since WO-137 (item 1: the level gate, Geldis's talk dropped as a catch-up; item 2: eight places by area, `places: true` for all). After the PC's check (22 Oct) the level-up node is the gate, not a way: the test now wants Level 20 on reading the book and the Haknir's Shoal way. For Bob: the Must line above still names the level-up way.
- Fails today: **WO-154** (Bob's word): Deathbrand is read now, and its read has no level 20 gate (needs: nothing), though the PC's check found it (WO-137).

**13. "How do I start a missive from the notice board?"**
- Calls: `get_quest({ name: "Missives" })` and one Missives quest by EDID.
- Must: the board class answered, with the twelve boards; not "unknown" and not "this line hasn't passed the start check". A line whose quests are all checked as a class says so.
- Passes since WO-137 item 3.

**14. "What quests are in my quest log?" (Kyria's Save 70)**
- Calls: `get_quest_log({ playthrough })`.
- Must: each line under its own category ("Guilds and factions", "Jobs and errands"), never one heading for everything; no helper names (TG00 Misc Handler, LTN Quest Handler) in the log; no quest at stage 0 listed as "started but unclear" (a stage 0 isn't started); no quest listed twice (Animal Extermination, Special Delivery).
- Passes since WO-137 item 4. The test uses the stages Bob named from Save 70, not the whole save (no copy of it is in the repo).

**15. "How do I free Inigo from the jail?"**
- Calls: `search_facts({ query: "free Inigo" })`, `get_quest({ id: "inigo" })`.
- Must: finds Inigo's line (Followers) and says where he is and how he joins, or says the start isn't checked yet. Not "no quest matched".
- Passes since WO-137 item 5.

**16. A line whose quest is checked.** Asking for one quest in a line that hasn't passed the line's start check (Whiterun, expanded; Odd jobs in the Rift; Deathbrand) must give that quest's own checked start, and say plainly what's unchecked about the line, once. Not "no instructions are given" over a checked answer.
- Passes since WO-137 item 3.

**17. "How do I start the quest to get the paraglider? I'm level 12."**
- Calls: `search_facts({ query: "paraglider" })`, `get_quest({ name: "Paragliding in Skyrim", level: 12 })`.
- Must: a place (near Falkreath), what happens (a man falls from the sky), the journal that moves it to step two; no trigger name ("Para Intro Gazebo Discover"); "open for you" at level 12, not "unknown".
- Passes since WO-137 item 6: Dave's finding by hand in `overrides.json` (a player's report), and a trigger start counts as a way in, not a need. Dave's Claude had said "unknown" and asked for his LoreRim folder.

**18. "How do I become Thane of Whiterun?"**
- Calls: `get_quest({ name: "Thane of Whiterun" })`.
- Must: the jarl by name (Balgruuf the Greater) in Dragonsreach, with "Vignar Gray-Mane if the Stormcloaks hold Whiterun"; the need "once you've helped people of the hold"; never "It starts by itself when you enter Whiterun" as a way in; never a way with no place.
- Passes since WO-138 Part 4b (fix 2: the sitting jarl in their keep, the other side's jarl named, the hidden start a gate).

**19. "Design me a new character."**
- Calls: `get_style_guide()`; the descriptions of `create_build` and `create_playthrough`.
- Must: the guide holds the Before you design section with its eight always-ask questions worded as WO-139 says, the softened reason-to-travel line, the mods rule, and the How to build line; both descriptions point to it.
- Passes since WO-139 Part 1.

**20. "What can she do in Windhelm at level 12?"** on a playthrough whose `never` holds `the-dark-brotherhood` and `main-quest`.
- Calls: `suggest_quests({ level: 12, where: "Windhelm", playthrough })`.
- Must: neither Join the Dark Brotherhood nor a main-quest story; a line saying what was left out and why.
- Passes since WO-139 Part 3.

**21. "How do I start Dawnguard?"** on that playthrough.
- Calls: `get_quest({ name: "Dawnguard", playthrough })`, and `get_quest({ name: "Dragonborn", playthrough })` for the line the main quest does close.
- Must: Dawnguard open, by Agmaer in Fort Dawnguard; Dragonborn (Solstheim) `locked for this character: she won't be the Dragonborn`. Never Dawnguard "locked for this character".
- Changed by Jeff under WO-139 (Bob to rule): the question as written had Dawnguard locked, but the records don't gate it on the main quest. Talking to Agmaer at Fort Dawnguard has no need, and Durak's need "Dragonborn stage 5 or The Way of the Voice before stage 160" is met by a main quest never begun. The planner must not say locked when the records say open (style guide rule 24). Dragonborn waits on The Way of the Voice (stage 160), so it is the one the never closes.
- Passes since WO-139 Part 3.
- Fails today: **WO-154 Part 1b** (Bob's word): Dawnguard's opening quest is read now, and the read names no one who starts it (the five at Fort Dawnguard are under what it is unsure of), so "Agmaer" isn't in the answer.

**22. "What mods does Kyria need?"**
- Calls: `get_playthrough({ playthrough: "Kyria Severa" })`.
- Must: `mods` lists Callings as required, with Dave's why; the guide's mods page says the same, and neither shows a link while Callings is unpublished.
- Passes since WO-139 Part 4, on the shape. The live check on Kyria's own row is Bob's, once `set_details` has put Callings there (Jeff has no access to that row).

**23. "Who could an Orc take as a follower, and where?"**
- Calls: `suggest_followers({ race: "Orc" })` or `search_facts({ query: "orc follower" })`.
- Must: Borgakh the Steel Heart (Mor Khazgur), Ghorbash the Iron Hand (Dushnikh Yal), Ugor and Lob (Largashbur), each with where they stand and how they join, in the game's words. Never "the planner has no data on orc followers".
- Fails today: **WO-141 Part 2**.

**24. "How do I get a horse? I'm level 5 in Riften."**
- Calls: `get_rules()` (mounts), `get_quest({ name: "Running Wild", level: 5 })`.
- Must: a stable sells one for 1,500 gold; Running Wild open at level 5 (no false "comes after"); the tamed wild horse; the paraglider.
- Passes since WO-142 (the 1,500 is the economy notes' figure, not yet rechecked in the game files).

**25. "Kyria is a bard in Riften; what can she do here as one?"**
- Calls: `suggest_doings({ playthrough, act: "1", calling: "Bard" })`.
- Must: the Bee and Barb (an inn to play), and where Riften's books are; nothing invented.
- Fails today: **WO-143**.

**26. "What's near Riften for Kyria's first act?"**
- Calls: `suggest_places({ playthrough: "Kyria Severa", act: "1" })`.
- Must: places with pointers near Riften; the distance in a walk band ("a short walk from Riften", "next to Riften"); a town's unattributed line as "people in Riften"; Largashbur as the Orcs' own home, in their words at the door; a place with no levels says "not checked yet"; no "doesn't measure distances from Riften" note.
- Never: kilometres; the Thieves Guild Headquarters; a helper or vendor script among the quests that go there ("Radiant Guild Trophy Enabler", "BCSLL Vendor Quest"); "someone the line doesn't name".
- Passes since WO-151 (the distances, the guild hall, the helper names, the speakers, "not checked yet"). The levels of the places that say "not checked yet" are WO-144 Part 1e-3 (the data).

**27. "Where is Calm sold?"**
- Calls: `get_spell({ name: "Calm" })` or `search_facts({ query: "Calm", kinds: ["spell"] })`.
- Must: the vendors who carry its tome and their towns; never "no merchant is given".
- Fails today: **WO-144 Part 2**.

**28. "Where are the Sneak skill books?"** and **29. "Where can a scholar read in Solitude?"**
- Calls: `search_facts({ query: "Sneak skill book" })`; `search_facts({ query: "books in Solitude" })`.
- Must: each Sneak skill book with its places or "not checked yet"; the Bards College's library and the Blue Palace with counts.
- Fail today: **WO-144 Part 3**.

**30. "What can Kyria do for work in Riften?"**
- Calls: `suggest_doings({ playthrough: "Kyria Severa", act: "1" })`.
- Must: the jobs mod's shifts in Riften with their employers, the Missives board, the Bee and Barb to play; each with its mod named.
- Fails today: **WO-144 Part 4** (with WO-143 Part 2 for the tool).

**31. "How does Kyria get from 15 to 20 in Act III?"**
- Calls: `get_playthrough({ playthrough: "Kyria Severa" })`, `suggest_objective` for Act III.
- Must: XP needed (about 3,300 from 15 to 20 on the curve), what Act III's plan pays, the gap, and named fillers with their XP, core game first (a camp or dungeon on the route, an at-level side quest, a missive along the route), a calling day last; never Tome Trials before Tending the Flames.
- Fails today: **WO-145**.

**32. "What level will she be at the end of Act II?"**
- Calls: `get_playthrough`.
- Must: the level the act's XP reaches, computed; not the typed range.
- Fails today: **WO-145**.

**33. "Tell me about A Rat Problem."**
- Calls: `get_quest({ name: "A Rat Problem" })`.
- Must: a link to the quest's own page (`/quests/q/…`); its own start; no line-level opening from another quest (the Bluesky Hall messenger); no "comes after".
- Passes since WO-147.

**34. "What quests are open in Haafingar at level 15?"**
- Calls: `suggest_quests({ level: 15, where: "Haafingar" })`.
- Must: stories in the hold's towns and places, each with its start; never `start: null` without a reason.
- Passes since WO-148 (items 1 and 2).

**35. "How do I start Laid to Rest?"**
- Calls: `get_quest({ name: "Laid to Rest" })`.
- Must: the way in (Morthal, the burned house, Lami or the jarl), not a key to Sorli's House; `openForYou` open or a real need.
- Passes since WO-148 item 5 (the key is the first step's `onTheWay` detail, not a need). The way in the data says is "something placed in Morthal, by the door to Eisa's House", then "Talk to the Jarl of Morthal"; Lami isn't named.
- Fails today: **WO-154** (Bob's word): Laid to Rest is read now, and its read gives Sorli in Stonehills as another way in when she is Jarl, which WO-148 Part 2 kept out.

**36. "Can Kyria take Tome Trials exams now?"**
- Calls: `get_rules()` (or the doings index).
- Must: not until Tending the Flames is done; 36 books, 50 / 100 / 200 XP by tier, Speech 50 and 75 for tiers 2 and 3.
- Passes since WO-148 item 8 (`get_rules`' `tomeTrials`).

**37. "Where do I find Jaree-Ra?"**
- Calls: `get_quest({ name: "Lights Out!" })`, `get_person({ name: "Jaree-Ra" })`.
- Must: by day on the streets of Solitude near the Winking Skeever (Dave, in game, 23 Oct); never "in Red Wave" as where to find him.
- Fails today: **WO-152**.
