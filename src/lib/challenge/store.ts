import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { newBuildId } from "@/lib/builds/ids";
import { killTotal, madeTotal, type Run } from "./run-file";

const { challengeRuns, users } = schema;

export interface BoardRow {
  id: string;
  characterName: string;
  race: string;
  level: number;
  mode: "oath" | "honor";
  days: number;
  itemsMade: number;
  rulesBroken: number;
  kills: number;
  player: string;
  /** The player's Discord picture, when they have one. */
  image: string | null;
  handle: string | null;
  uploadedAt: Date;
}

export interface SavedRun extends BoardRow {
  run: Run;
  consoleOpened: number;
  writtenAt: Date;
  userId: string;
}

const boardColumns = {
  id: challengeRuns.id,
  characterName: challengeRuns.characterName,
  race: challengeRuns.race,
  level: challengeRuns.level,
  mode: challengeRuns.mode,
  daysPassedX100: challengeRuns.daysPassedX100,
  itemsMade: challengeRuns.itemsMade,
  rulesBroken: challengeRuns.rulesBroken,
  kills: challengeRuns.kills,
  player: users.name,
  image: users.image,
  handle: users.handle,
  uploadedAt: challengeRuns.uploadedAt,
};

type Raw = { daysPassedX100: number; player: string | null };
const shape = <T extends Raw>({ daysPassedX100, player, ...rest }: T) => ({ ...rest, days: daysPassedX100 / 100, player: player ?? "A player" });

/** The leaderboard: fewest rules broken first, then the most in-game days, then the newest upload. */
export async function boardRows(limit = 100): Promise<BoardRow[]> {
  const rows = await db()
    .select(boardColumns)
    .from(challengeRuns)
    .innerJoin(users, eq(users.id, challengeRuns.userId))
    .where(eq(challengeRuns.mode, "oath"))
    .orderBy(asc(challengeRuns.rulesBroken), desc(challengeRuns.daysPassedX100), desc(challengeRuns.uploadedAt))
    .limit(limit);
  return rows.map(shape);
}

export async function savedRun(id: string): Promise<SavedRun | null> {
  const [row] = await db()
    .select({ ...boardColumns, run: challengeRuns.run, consoleOpened: challengeRuns.consoleOpened, writtenAt: challengeRuns.writtenAt, userId: challengeRuns.userId })
    .from(challengeRuns)
    .innerJoin(users, eq(users.id, challengeRuns.userId))
    .where(eq(challengeRuns.id, id))
    .limit(1);
  return row ? shape(row) : null;
}

/** A player's own runs, newest first, for the upload box. */
export async function runsOf(userId: string): Promise<BoardRow[]> {
  const rows = await db()
    .select(boardColumns)
    .from(challengeRuns)
    .innerJoin(users, eq(users.id, challengeRuns.userId))
    .where(eq(challengeRuns.userId, userId))
    .orderBy(desc(challengeRuns.uploadedAt));
  return rows.map(shape);
}

export type SaveResult = { ok: true; id: string } | { ok: false; reason: "older" };

/**
 * Saves a checked run file. A player has one row per character: a file written later replaces it, and a file
 * written earlier than the one already there is refused, so an old save can't roll a run back.
 */
export async function saveRun(userId: string, run: Run, seal: string): Promise<SaveResult> {
  const writtenAt = new Date(run.written);
  const values = {
    characterName: run.character.name,
    race: run.character.race,
    level: run.character.level,
    mode: run.mode,
    daysPassedX100: Math.round(run.daysPassed * 100),
    itemsMade: madeTotal(run),
    rulesBroken: run.rulesBroken.length,
    kills: killTotal(run),
    consoleOpened: run.consoleOpened,
    run,
    seal,
    writtenAt,
  };
  const [mine] = await db()
    .select({ id: challengeRuns.id, writtenAt: challengeRuns.writtenAt })
    .from(challengeRuns)
    .where(and(eq(challengeRuns.userId, userId), eq(challengeRuns.characterName, run.character.name)))
    .limit(1);
  if (mine) {
    if (mine.writtenAt.getTime() > writtenAt.getTime()) return { ok: false, reason: "older" };
    await db()
      .update(challengeRuns)
      .set({ ...values, uploadedAt: new Date() })
      .where(eq(challengeRuns.id, mine.id));
    return { ok: true, id: mine.id };
  }
  const id = newBuildId();
  await db()
    .insert(challengeRuns)
    .values({ id, userId, ...values });
  return { ok: true, id };
}

export async function removeRun(id: string, userId: string): Promise<boolean> {
  const gone = await db()
    .delete(challengeRuns)
    .where(and(eq(challengeRuns.id, id), eq(challengeRuns.userId, userId)))
    .returning({ id: challengeRuns.id });
  return gone.length > 0;
}
