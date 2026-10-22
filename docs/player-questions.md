# The player's questions

The test nothing counts as done without (WO-135). Each question is asked as a player types it to their assistant. Under
it: the tools an assistant would call, and what the answer must hold and must never hold. `src/lib/mcp/player-questions.test.ts`
runs each one through the door's own handlers on the real data and checks the answer; `npm run test:questions` prints
every question with pass or fail and what it got.

Every answer, on top of its own list, must never hold: an editor id (`MyrwatchTNE_Quest`, `ccBGSSSE002_...`), a form id
(`Skyrim.esm:0DC9E0`), a raw condition function (`GetIsRace`, `fn629`) or "someone the records don't name". The record
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

**4. "How do I start Caught Red Handed?"**
- Calls: `get_quest({ name: "Caught Red Handed" })`.
- Must: Svana Far-Shield, Haelga's Bunkhouse, and that a condition isn't named yet; then "Obtain a Mark of Dibella from Bolli".

**5. "How do I start The Blessings of Nature?"**
- Calls: `get_quest({ name: "The Blessings of Nature" })`.
- Must: Danica Pure-Spring, Temple of Kynareth, Whiterun; then "Retrieve Nettlebane". Never "Inspect the Temple of Kynareth" as the first step.

## Where things are

**6. "Where do I find the book for Running Wild?"**
- Calls: `get_quest({ name: "Running Wild" })`.
- Must: a place for The Palonimo Mare, or "isn't checked yet". Never a guess.
- Passes since WO-131 Part 0.

**7. "Where do I find the book for …?", for every other read-this start (61 ways today: the Dark Brotherhood's extra contracts, Boethiah's Calling, Deathbrand, Lost to the Ages, Wyrmstooth's notes and the rest).**
- Calls: `get_quest({ id: <its EDID> })`.
- Must: each read-this way has its place, or the start says where to find it isn't checked yet.
- Fixed by: WO-131 Part 2.

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
