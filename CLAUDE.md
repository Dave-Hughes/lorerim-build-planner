# Working on the LoreRim Build Planner

Read `README.md` first (environments, scripts, code map, game-data pipeline). Then:

- `docs/design-rules.md`: the look and the copy rules. The LoreRim community is quick to call out anything that looks AI-made; every screen must read as hand-built for this game. The design canvas linked there is the source of truth for layout.
- `docs/backlog.md`: what is queued and what is decided.
- `docs/pipeline.md`: how orders move between Dave, Bob and the Jeffs, with the standing prompts and the `Status:` line.
- `docs/work-orders.md`: the orders to build, each with "Done when" boxes. Work one order at a time on `staging`, tick its boxes in the same commit, and stop when its screenshots are ready for Dave. Dave reviews in the app; the chat session writes and revises the orders.

## Rules

- Branches: commit to `staging`, check the preview (`lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app`, open to anyone with the link), then fast-forward `main` and push it separately. Never push both branches at the same commit in one go.
- Databases: three Neon branches (production, staging, dev), one per environment; `src/db/environments.ts` refuses a mismatched `DATABASE_URL`. Never run a destructive database operation without asking Dave first. Schema changes go through `npm run db:generate` and committed SQL in `drizzle/`.
- Secrets live in Vercel (`vercel env pull .env.local` for local work) and `.env.local`; never commit them, print them, or paste them into chat.
- Game data (`src/data/lorerim-5.0.4.8/perks.json`, `traits.json`) is generated: edit `gamedata/5.0.4.8/overrides.json` or the scripts in `scripts/gamedata/`, then `python3 scripts/gamedata/build.py`. Never hand-edit the generated files.
- Before calling a change done: `npm run typecheck`, `npm run lint`, `npm test`, and for screen changes `npm run build` then `npm run test:e2e` (seeds and cleans the dev database). Screenshot screens with `scripts/shot.mjs` and compare against the design canvas.
- The player's questions (`docs/player-questions.md`, `npm run test:questions`, part of `npm test`): no order that changes what an assistant is told is done until the questions it touches pass, and their "fails today" marks come off. When Dave finds a question that fails, Bob adds it to `player-questions.md` before the fix is written.
- Use the game's words. Perk and trait text comes from the records; don't paraphrase it.
- Commit messages: plain English, say what changed and why. Dave is the author of the project; co-author lines for an AI assistant go at the end of the message.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
