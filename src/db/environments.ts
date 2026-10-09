/**
 * Which Neon branch each environment must use. Endpoint ids are not secrets
 * (they carry no password); they let the app and the migration script refuse
 * to run against the wrong database.
 *
 * Neon project: lorerim-build-planner (weathered-bonus-08840193), in the
 * Vercel-managed Launch org. Created from Vercel > Storage.
 */
export const DATABASES = {
  production: { branch: "production", endpoint: "ep-curly-dust-b8hk08m6" },
  staging: { branch: "staging", endpoint: "ep-summer-darkness-b8k8re4t" },
  development: { branch: "dev", endpoint: "ep-lucky-night-b85dscp1" },
} as const;

export type AppEnvironment = keyof typeof DATABASES;

/** The environment this process is running as. */
export function currentEnvironment(env: NodeJS.ProcessEnv = process.env): AppEnvironment {
  if (env.VERCEL_ENV === "production") return "production";
  if (env.VERCEL_ENV === "preview") return "staging";
  return "development";
}

/** The environment a connection string points at, or null if unknown. */
export function environmentOfUrl(url: string): AppEnvironment | null {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  for (const [name, db] of Object.entries(DATABASES)) {
    // Pooled hosts look like ep-xxx-pooler.region..., direct ones ep-xxx.region...
    if (host.startsWith(`${db.endpoint}.`) || host.startsWith(`${db.endpoint}-pooler.`)) return name as AppEnvironment;
  }
  return null;
}

/**
 * Throws unless DATABASE_URL points at this environment's own branch.
 * Production only ever talks to production, previews only to staging,
 * local only to dev.
 */
export function assertDatabaseMatchesEnvironment(env: NodeJS.ProcessEnv = process.env): string {
  const url = env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  const expected = currentEnvironment(env);
  const actual = environmentOfUrl(url);
  if (actual !== expected) {
    throw new Error(
      `Refusing to connect: this is the ${expected} environment but DATABASE_URL points at ` +
        `${actual ? `the ${actual} database` : "an unknown database"}. ` +
        `Expected the Neon "${DATABASES[expected].branch}" branch.`,
    );
  }
  return url;
}
