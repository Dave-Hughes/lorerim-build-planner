/**
 * Early-access invites (WO-96): the link's token, how it's kept, and whether an invite still works.
 * Pure, so the rules are tested without a database; invite-actions.ts does the writing.
 */
import { createHash, randomBytes } from "node:crypto";

/** How long an invite works. */
export const INVITE_DAYS = 14;

/** A new invite's token: 32 random bytes, URL-safe. Shown once, in the link; never stored. */
export function newInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

/** What's stored for a token: its SHA-256, hex. */
export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** A token's shape, checked before any lookup. */
export function isInviteToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function inviteExpiry(now: Date = new Date()): Date {
  return new Date(now.getTime() + INVITE_DAYS * 24 * 3600 * 1000);
}

export type InviteState = "waiting" | "used" | "ran out";

/** Where an invite stands: used once it's been used, ran out after its 14 days, else waiting. */
export function inviteState(i: { usedBy: string | null; expiresAt: Date }, now: Date = new Date()): InviteState {
  if (i.usedBy) return "used";
  return i.expiresAt.getTime() <= now.getTime() ? "ran out" : "waiting";
}

/** The longest line an admin can write for Tapps on an invite. */
export const INVITE_MESSAGE_MAX = 400;

/** What Tapps says on an invite's page: the admin's own line for this person, else the usual one with their name. */
export function inviteLine(label: string, message?: string | null): string {
  const own = message?.trim();
  return own || `${label}, you're invited in early. Make a build, look around, and tell me what you think before it opens to everyone.`;
}

/** An invite can be used only while it's waiting: once, and inside its 14 days. */
export const canUseInvite = (i: { usedBy: string | null; expiresAt: Date } | null | undefined, now: Date = new Date()) => !!i && inviteState(i, now) === "waiting";
