# LoreRim Build Planner

Plan and share LoreRim character builds level by level. Rules and game data are for LoreRim 5.0.4.8.

Next.js (App Router) on Vercel, Postgres on Neon, Drizzle ORM, Auth.js with Discord sign-in.

## Environments

Three separate databases, one per environment. Each is a branch of the Neon project `lorerim-build-planner` (Launch plan, in the Vercel-managed Neon org; create or manage it from Vercel > Storage). Production is a protected branch, and each branch has its own password.

| Environment | Runs where | Git branch | Neon branch | Migrations applied by |
|---|---|---|---|---|
| Production | Vercel Production | `main` | `production` | Every production build |
| Staging | Vercel Preview | `staging` (and other previews, read only) | `staging` | Preview builds of `staging` only |
| Local | Your machine | any | `dev` | `npm run db:migrate` |

Safety rails:

- `src/db/environments.ts` knows each branch's Neon endpoint. The app and the migration script refuse to connect if `DATABASE_URL` doesn't match the environment they run in. A preview can't reach production, a laptop can't reach production, and production can't be pointed at staging or dev by mistake.
- Migrations are SQL files in `drizzle/`, generated from `src/db/schema.ts` and committed. There is no `db:push`; every schema change goes through a reviewed migration.
- A schema change reaches production only after it has run on dev (locally) and then staging (merge to `staging`).
- Push `staging` and `main` separately. Vercel treats a deployment as production when its commit is also the head of `main`, so pushing both branches at the same commit in one go gives two production deployments instead of a preview. The normal order (commit to `staging`, check the preview, then merge to `main` and push `main`) never does that.

### Switches and config in the environment

- `FEATURE_STORY` and `FEATURE_SITE_GUIDE` (WO-81): `on` turns the Story and the site's beginner's guide on. Unset, they're on only under `npm run dev`, so staging and production show the launch view with both hidden. The e2e server turns both on, and a second e2e server (the `launch` project) keeps both off.
- `FEATURE_COMING_SOON` (WO-84): `on` puts the coming soon page in front of every page, at its own URL, for everyone but signed-in admins. Off unless set, `npm run dev` included; Dave turns it on for production only, and off at launch. `/signin` (linked from nowhere) signs an admin in behind it. A third e2e server (the `soon` project) runs with it on.
- `SAMPLE_BUILD_ID` (WO-80): the build the first visit offers to walk through. Unset, it's the built-in example build.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the dev DATABASE_URL, AUTH_SECRET, Discord keys
npm run db:migrate           # applies migrations to the dev branch
npm run dev
```

## Changing the schema

```bash
# 1. edit src/db/schema.ts
npm run db:generate -- --name short_description   # writes drizzle/NNNN_short_description.sql
# 2. read the SQL, then apply to dev
npm run db:migrate
# 3. commit, merge to staging (Vercel migrates staging), check it, merge to main (Vercel migrates production)
```

To refresh dev or staging with production data, reset the branch from its parent in the Neon console.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm test` | Unit tests: rules engine, derived views, tree layouts, environment guard |
| `npm run test:e2e` | Playwright tests against a production build (run `npm run build` first). Seeds a test author and session in the dev database and removes them after |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run db:generate` | New migration from schema changes |
| `npm run db:migrate` | Apply migrations (guarded) |
| `npm run db:studio` | Drizzle Studio on the dev database |
| `vercel-build` | What Vercel runs: guarded migrate, then `next build` |

## Code map

- `src/app/(site)/` pages with the site header: Browse builds `/`, My builds `/me`, shared build `/b/[id]`.
- `src/app/(focus)/` pages with the compact header: creation flow `/new`, level-up editor `/b/[id]/edit`, setup changes `/b/[id]/setup`.
- `src/components/build/` the shared build page and the pieces the editor reuses (constellation `Tree`, tree tabs, level ruler and row, cards).
- `src/components/creation/` the six-step creation flow. A new build lives in the browser (`localStorage`) until it is saved, so sign-in can happen at the end.
- `src/components/editor/` the level-up editor: pure plan edits in `plan-ops.ts`, autosave in `use-autosave.ts`.
- `src/lib/rules/` rules engine. `versions.ts` lists the LoreRim versions and which is current; `gameData(version)` in `data.ts` loads one version's data and rules; `convert.ts` moves a plan to another version. A saved build stores choices only (`BuildPlan`); `computeBuild` replays them level by level to get skills, points, Health/Magicka/Stamina, carry weight and problems. `derive.ts` turns that into what screens show (changes at a level, perk availability, ruler marks); `layout.ts` places perks as constellations.
- `src/lib/builds/` server actions, queries, validation (zod), ids, the example build.
- `src/data/lorerim-5.0.4.8/` game data as JSON, versioned by LoreRim release. Built from the game files; see below.
- `public/traits/` trait pictures from the game, converted to WebP.
- `src/db/` schema, client, environment guard.
- `src/auth.ts` Discord sign-in (identify scope only, no email).
- `scripts/shot.mjs` screenshots a screen for checking against the design canvas.
- Design rules: project doc `lorerim/planner/design-rules.md`.

## Game data

`src/data/lorerim-<version>/perks.json` and `traits.json` are generated, not hand-edited. The raw extract and the hand-kept facts live in `gamedata/<version>/`:

| File | From |
|---|---|
| `planner_data.json` | `scripts/gamedata/extract.py`, run on a PC with LoreRim installed. Reads the winning PERK, AVIF, SPEL, FLST, QUST, INGR, MISC and ALCH records in the Ultra load order, the Destiny wheel from the Custom Skills config and the trait list. Reads only. |
| `books.json` | `scripts/gamedata/books.py`: which book scripts grant the perks that can't be taken from the menu (the Smithing books). |
| `traitpics.json` | `scripts/gamedata/traitpics.py`: converts each trait's DDS thumbnail to `public/traits/<name>.webp`. |
| `overrides.json` | Hand-kept: quest wording, carry weight bonuses, which traits the numbers simulate, and perk records that stand in for a tree node. |

Then, from the repo root: `python3 scripts/gamedata/build.py`. It decodes every perk's conditions (skill, level, prerequisites, "any of" groups, exclusions, items to carry, quests) and prints a note for anything it couldn't place. `skills.json`, `races.json`, `birthsigns.json`, `stones.json`, `starts.json` and `deities.json` are still kept by hand.

The three Python scripts expect `esp.py` beside them and a LoreRim install at `~/mnt/LoreRim` (the Claude desktop app's mount of `C:\LoreRim`); change `ROOT` in `esp.py` for another path.

### Adding a LoreRim version

Every build records the LoreRim version it was made for and is only ever checked against that version's data. To add a release:

1. On a PC with the new release installed, run the extractor into `gamedata/<version>/` (`scripts/gamedata/extract.py`, then `books.py` and `traitpics.py`), and copy over or update `overrides.json` and the hand-kept files.
2. Build it into `src/data/lorerim-<version>/`: `python3 scripts/gamedata/build.py`, and read the notes it prints for anything it couldn't place.
3. Register it in `src/lib/rules/versions.ts`: import its JSON files, add an entry (`id`, `label`, `released`) with its `Rules` (`src/lib/rules/constants.ts`; copy the previous version's and change what the release changed), and keep the list oldest first.
4. Move `current: true` to it. Exactly one version is current: new builds default to it, Browse shows it first, and builds for older versions get a "Copy for <version>" that converts a copy and lists what didn't carry over.

Nothing in the app reads a version's data except through `gameData(version)` (server and rules code) or `useGameData()` (client components, under a `GameDataProvider` set from the build's version). A version removed from `versions.ts` still opens: its builds show the plan as stored with "LoreRim <version> is no longer in the planner."

## Who can do what

| | Visitor | Signed in | Author |
|---|---|---|---|
| See public and link-only builds, step through levels, open perk trees | yes | yes | yes |
| See a private build | no | no | yes |
| Copy a build into their own | sign in first | yes | yes |
| Create, edit, set visibility, delete | no | yes (own builds) | yes |

## Vercel environment variables

| Key | Production | Preview | Development |
|---|---|---|---|
| `DATABASE_URL` | production branch | staging branch | dev branch |
| `AUTH_SECRET` | own value | own value | own value |
| `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` | Discord app | Discord app | Discord app |

Discord redirect URLs to register: `https://<production domain>/api/auth/callback/discord`, the staging preview domain, and `http://localhost:3000/api/auth/callback/discord`.
