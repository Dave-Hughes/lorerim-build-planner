import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { assertDatabaseMatchesEnvironment } from "./environments";

type Db = ReturnType<typeof drizzle<typeof schema>>;
let instance: Db | undefined;

/** Lazily connects so pages that don't touch the database build without one. */
export function db(): Db {
  if (!instance) {
    const url = assertDatabaseMatchesEnvironment();
    instance = drizzle(neon(url), { schema });
  }
  return instance;
}

export { schema };
