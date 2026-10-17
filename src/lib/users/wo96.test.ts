import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getTableColumns } from "drizzle-orm";
import { schema } from "@/db";
import { passes, passesSession, type SessionAccess } from "./admin-session";
import { canUseInvite, hashInviteToken, inviteExpiry, inviteLine, inviteState, isInviteToken, newInviteToken } from "./invites";
import { passesComingSoon } from "@/lib/coming-soon";

describe("who passes the coming soon page (WO-96)", () => {
  const sessions: Record<string, SessionAccess | null> = {
    admin: { admin: true, earlyAccessAt: null },
    early: { admin: false, earlyAccessAt: new Date("2026-10-17") },
    player: { admin: false, earlyAccessAt: null },
  };
  const lookup = async (t: string) => sessions[t] ?? null;

  it("passes an admin and an early-access player, and nobody else", async () => {
    expect(await passesSession("admin", lookup)).toBe(true);
    expect(await passesSession("early", lookup)).toBe(true);
    expect(await passesSession("player", lookup)).toBe(false);
    expect(await passesSession("expired-or-unknown", lookup)).toBe(false);
    expect(await passesSession(undefined, lookup)).toBe(false);
    expect(passes(null)).toBe(false);
  });

  it("lets an invite's page through, so a signed-out player can reach it", () => {
    expect(passesComingSoon("/invite/abc")).toBe(true);
    expect(passesComingSoon("/invitee")).toBe(false);
  });
});

describe("invites (WO-96)", () => {
  it("keeps a token only as its SHA-256", () => {
    const token = newInviteToken();
    expect(isInviteToken(token)).toBe(true);
    expect(hashInviteToken(token)).toBe(createHash("sha256").update(token).digest("hex"));
    expect(hashInviteToken(token)).not.toContain(token);
    // The table has a hash column and nowhere to put the token itself.
    const cols = Object.keys(getTableColumns(schema.invites));
    expect(cols).toContain("tokenHash");
    expect(cols.filter((c) => /token/i.test(c))).toEqual(["tokenHash"]);
  });

  it("works once, and only for 14 days", () => {
    const now = new Date("2026-10-17T12:00:00Z");
    const fresh = { usedBy: null, expiresAt: inviteExpiry(now) };
    expect(fresh.expiresAt.getTime() - now.getTime()).toBe(14 * 24 * 3600 * 1000);
    expect(canUseInvite(fresh, now)).toBe(true);
    expect(inviteState(fresh, now)).toBe("waiting");
    const used = { ...fresh, usedBy: "user-1" };
    expect(canUseInvite(used, now)).toBe(false);
    expect(inviteState(used, now)).toBe("used");
    const later = new Date(fresh.expiresAt.getTime() + 1);
    expect(canUseInvite(fresh, later)).toBe(false);
    expect(inviteState(fresh, later)).toBe("ran out");
    expect(canUseInvite(null, now)).toBe(false);
  });

  it("says the admin's own line for the person, else the usual one with their name", () => {
    expect(inviteLine("Zenematics")).toBe("Zenematics, you're invited in early. Make a build, look around, and tell me what you think before it opens to everyone.");
    expect(inviteLine("biggie_boss", "  A line just for you.  ")).toBe("A line just for you.");
    expect(inviteLine("biggie_boss", "   ")).toMatch(/^biggie_boss, you're invited in early\./);
  });

  it("checks a link's token shape before any lookup", () => {
    expect(isInviteToken("short")).toBe(false);
    expect(isInviteToken("a".repeat(43))).toBe(true);
    expect(isInviteToken("a".repeat(42) + "/")).toBe(false);
  });
});
