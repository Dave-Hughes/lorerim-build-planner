import "server-only";
import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db, schema } from "@/db";

/** Tapps, who made the planner: found by his Discord id (public), so each environment uses its own record. */
const MAKER_DISCORD_ID = "1361016832206835942";
/** His Discord avatar when this environment has no record of him (he hasn't signed in there). */
const FALLBACK = { name: "Tapps", image: "https://cdn.discordapp.com/avatars/1361016832206835942/c1400ebf5e1e38a41d255b4ecbf6b840.png", handle: null as string | null };

/** The footer's "Made by Tapps": his name, picture and profile handle. Cached for a day. */
export const getMaker = unstable_cache(
  async () => {
    try {
      const [row] = await db()
        .select({ name: schema.users.name, image: schema.users.image, handle: schema.users.handle })
        .from(schema.accounts)
        .innerJoin(schema.users, eq(schema.users.id, schema.accounts.userId))
        .where(and(eq(schema.accounts.provider, "discord"), eq(schema.accounts.providerAccountId, MAKER_DISCORD_ID)))
        .limit(1);
      return row ? { name: "Tapps", image: row.image ?? FALLBACK.image, handle: row.handle } : FALLBACK;
    } catch {
      return FALLBACK;
    }
  },
  ["site-maker"],
  { revalidate: 86_400 },
);
