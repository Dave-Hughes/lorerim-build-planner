/**
 * Account age (WO-40): a Discord id is a snowflake, so it says when the account was made. An account
 * under 7 days old can make Link-only and Private builds, but can't list a build or upload images yet.
 */

const DISCORD_EPOCH = BigInt(1420070400000);
export const NEW_ACCOUNT_DAYS = 7;

/** When a Discord account was made, from its id; null for anything that isn't a snowflake. */
export function discordCreatedAt(id: string): Date | null {
  if (!/^\d{15,20}$/.test(id)) return null;
  return new Date(Number((BigInt(id) >> BigInt(22)) + DISCORD_EPOCH));
}

/** A snowflake for an account made at `at` (for test accounts). */
export function snowflakeAt(at: Date): string {
  return ((BigInt(at.getTime()) - DISCORD_EPOCH) << BigInt(22)).toString();
}

/** When a new account may list and upload; null when it's old enough (or its age isn't known). */
export function newAccountUntil(discordId: string | null, now = new Date()): Date | null {
  const made = discordId ? discordCreatedAt(discordId) : null;
  if (!made) return null;
  const until = new Date(made.getTime() + NEW_ACCOUNT_DAYS * 86_400_000);
  return until > now ? until : null;
}

/** "Your Discord account is new. You can list builds and upload images from 19 Oct 2026." */
export function newAccountMessage(until: Date): string {
  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(until);
  return `Your Discord account is new. You can list builds and upload images from ${day}.`;
}
