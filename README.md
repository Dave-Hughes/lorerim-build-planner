# LoreRim Build Planner

Plan and share LoreRim character builds level by level. Rules and game data are for LoreRim 5.0.4.8.

Next.js (App Router) on Vercel, Postgres on Neon, Drizzle ORM, Auth.js with Discord sign-in.

## Environments

Three separate databases, one per environment. Each is a branch of the Neon project `lorerim-build-planner`.

| Environment | Runs where | Git branch | Neon branch | Migrations applied by |
|---|---|---|---|---|
| Production | Vercel Production | `main` | `production` | Every production build |
| Staging | Vercel Preview | `staging` (and other previews, read only) | `staging` | Preview builds of `staging` only |
| Local | Your machine | any | `dev` | `npm run db:migrate` |

Safety rails:

- `src/db/environments.ts` knows each branch's Neon endpoint. The app and the migration script refuse to connect if `DATABASE_URL` doesn't match the environment they run in. A preview can't reach production, a laptop can't reach production, and production can't be pointed at staging or dev by mistake.
- Migrations are SQL files in `drizzle/`, generated from `src/db/schema.ts` and committed. There is no `db:push`; every schema change goes through a reviewed migration.
- A schema change reaches production only after it has run on dev (locally) and then staging (merge to `staging`).

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
| `npm test` | Rules engine and environment guard tests |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run db:generate` | New migration from schema changes |
| `npm run db:migrate` | Apply migrations (guarded) |
| `npm run db:studio` | Drizzle Studio on the dev database |
| `vercel-build` | What Vercel runs: guarded migrate, then `next build` |

## Code map

- `src/lib/rules/` rules engine. A saved build stores choices only (`BuildPlan`); `computeBuild` replays them level by level to get skills, points, Health/Magicka/Stamina, carry weight and problems.
- `src/data/lorerim-5.0.4.8/` game data as JSON, versioned by LoreRim release.
- `src/db/` schema, client, environment guard.
- `src/auth.ts` Discord sign-in (identify scope only, no email).
- Design rules: project doc `lorerim/planner/design-rules.md`.

## Vercel environment variables

| Key | Production | Preview | Development |
|---|---|---|---|
| `DATABASE_URL` | production branch | staging branch | dev branch |
| `AUTH_SECRET` | own value | own value | own value |
| `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` | Discord app | Discord app | Discord app |

Discord redirect URLs to register: `https://<production domain>/api/auth/callback/discord`, the staging preview domain, and `http://localhost:3000/api/auth/callback/discord`.
