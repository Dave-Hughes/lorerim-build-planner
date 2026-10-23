# Design tests: Bob's battery through the door

Bob runs these as sub-agents that act as a player's assistant with only the planner's tools, then reads each report against the data and writes orders for the gaps. Run the battery again after any order that changes what assistants are told (WO-139, 141, 142, 143, WO-128 Part 5). Drafts are named "TEST: …" and private; delete them when done.

## The briefs
1. **Breton conjurer, the Dragonborn,** joins the College, a house in Whiterun, a follower by level 10. Build to 20, two acts.
2. **Argonian thief, never kills, not the Dragonborn,** Thieves Guild, a horse as soon as possible, starts in the Rift. Build to 15, one act in Riften.
3. **Nord bard, no fighting for ten levels,** Bards College, marries eventually, starts in Riverwood. Build to 15, two acts (Riverwood and Whiterun; the road to Solitude).
4. (Dave's) **Orc greatsword outcast, Blood Warrior,** starts in the Windhelm jail, not the Dragonborn, reclaim his place at Narzulbur, solo until a follower at 30.

## 23 Oct 2026, first run (before WO-139 to 143)
All four builds came out legal and faithful to the data; every assistant kept to the planner and said "not checked" rather than guessing. What they could not do, and the order each became:
- `suggest_places` empty for every real city (nearest town wrong): WO-128 Part 5.
- No Orc strongholds, settlements, city buildings, inns or temples as places; no Orc followers; where the teaching books are: WO-141.
- A false "comes after" gate outside the work shelf; a false objective-to-quest match; level 1 skill points taken silently; no mounts or homes facts; `suggest_quests` empty for Solitude; a place condition shown as a need; chapter paragraphs lost; no item names; get_rules silent on level 1: WO-142.
- "Never kills" and "not the Dragonborn" had nowhere to go: WO-139 Parts 3 and 5. No way to say performing is already in LoreRim, or that Callings is needed: WO-139 Part 4.
- Nothing tells an assistant what a calling can do in a town: WO-143.
- Spell merchants (where a spell is sold): not ordered yet; a PC data job for later (the vendor lists in the records).
