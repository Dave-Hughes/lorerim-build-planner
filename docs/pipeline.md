# The pipeline: how work moves between Dave, Bob and the two Jeffs

Written 23 Oct 2026, after the quest work ran this way for a day. Read this before taking an order.

## Who does what
- **Dave** decides what gets built, tests in the app and through his Claude, and gives the final word.
- **Bob** (the chat session) designs with Dave, writes orders in `docs/work-orders.md` with "Done when" boxes, reviews every push on `staging`, and writes feedback into the order. Bob never builds.
- **Jeff on Mac** builds the app and the generated data. **Jeff on PC** reads the game files at `C:\LoreRim` and builds the data tools. Each takes only orders marked for it.
- **Rex** reviews a sample of any batch work (a fresh agent with no edit tools), so Jeff never grades his own work.

## The order is the contract
Every order has, under its heading:
- `Status:` one of `queued`, `building (Mac)` / `building (PC)`, `for Bob`, `blocked (Mac)` / `blocked (PC)`, `done`, `parked`, `held`.
- Its "Done when" boxes. An order is done when every box is ticked and Bob has written `done`.
- Feedback from Bob arrives as a new part (`Part Nb`) with its own boxes, and the status goes back to `queued`. Feedback parts come before new orders.

## Jeff's loop (one standing prompt, run until told to stop)
1. `git pull --rebase origin staging`. Read `docs/pipeline.md` once, then `docs/work-orders.md`.
2. Take the first order marked for you with `Status: queued`: an order with an unticked feedback part first; otherwise the highest-numbered queued order (newest first), unless the order says it waits on the other Jeff's part that isn't on staging yet.
3. Set `Status: building (Mac)` (or PC), commit that one line and push at once, so the other Jeff and Bob see it taken.
4. Build the order as written. Under WO-138 Part 5 you decide any pattern or wording call yourself, write the decision and its reason under the order, and keep going. Run every check in CLAUDE.md (`npm test` includes the player questions). For batch work, Rex on a sample.
5. Push with the boxes ticked and `Status: for Bob`. Never push `main`. Rebase before every push; the other Jeff is pushing too.
6. If a check fails and a second try doesn't fix it, write what failed under the order, set `Status: blocked (Mac)`, push, and take the next queued order.
7. If nothing is queued for you, **don't stop and don't end your turn**: run this wait in the foreground (or as a background task you wait on), then go to 1. A Jeff that ends its turn stops the loop until Dave restarts it.
   `until git fetch -q origin staging && ! git diff --quiet HEAD origin/staging -- docs/work-orders.md; do sleep 300; done`
8. After a context compaction, read this file again before doing anything.
9. **Never ask Dave whether to keep going.** The answer is always yes, by this file. Ask only for a decision an order can't settle, and then write the question under the order, push it with `Status: blocked`, and take the next order.
10. Push a progress commit at least every 45 minutes on a long part (what's done, what's next, under the order), so Bob and Dave can see you're alive.

## Bob's loop
- For data work, Bob reads values, not counts: he pulls a few rows and asks whether a player would believe them.
- A watcher on `staging` (re-armed every 30 minutes while the chat with Dave is open) wakes Bob on every push by a Jeff.
- Bob pulls, reads the order's boxes against the push and against the live door or the preview (never only the tests), and writes one of: `Status: done`; or a feedback part with boxes and `Status: queued`.
- For data loops, Bob's rulings go to `gamedata/5.0.4.8/story_checks/bob-rulings.md`, which the PC reads at the start of every batch.
- Bob tells Dave only when something is overturned, blocked, or finished.

## Dave's part
- Start each Jeff once with its standing prompt (below), and again if it stops or after a long compaction. Keep the chat with Bob open while they run, or the watcher sleeps.
- Review in the app at milestones Bob names, and test through the connector against `docs/final-test.md`.
- The Jeffs never push `main`. Dave fast-forwards `main` when staging is reviewed.

## The standing prompts
Mac:
```
Pull staging and read docs/pipeline.md. Then run Jeff's loop as written for orders marked Mac, starting now, until I tell you to stop.
```
PC:
```
Pull staging and read docs/pipeline.md. Then run Jeff's loop as written for orders marked PC, starting now, until I tell you to stop. You have C:\LoreRim and the scripts in scripts/gamedata; Mac doesn't.
```

## Limits, plainly
- A Jeff that runs all day compacts its context; it has survived that, but step 8 exists for it. A fresh session each morning is cheaper than a confused one.
- Two Jeffs on one file conflict. The status line and "feedback parts first" keep them off the same order; rebasing handles the rest.
- The pipeline stops when Dave's chat with Bob closes. Nothing is lost; it picks up on the next push.
- Later, if wanted: a scheduled task that starts a fresh Mac Jeff every hour to take the next queued order. PC work needs the PC, so it stays a local session.
