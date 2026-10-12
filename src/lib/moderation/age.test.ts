import { describe, expect, it } from "vitest";
import { discordCreatedAt, newAccountMessage, newAccountUntil, snowflakeAt } from "./age";

describe("account age", () => {
  it("reads when a Discord account was made from its id", () => {
    // Discord's own documentation example: 175928847299117063 was made 2016-04-30T11:18:25.796Z.
    expect(discordCreatedAt("175928847299117063")?.toISOString()).toBe("2016-04-30T11:18:25.796Z");
    expect(discordCreatedAt("e2e-discord-admin-0001")).toBeNull();
  });

  it("holds back an account under 7 days old, until its 7th day", () => {
    const now = new Date("2026-10-12T12:00:00Z");
    const twoDays = snowflakeAt(new Date("2026-10-10T12:00:00Z"));
    expect(newAccountUntil(twoDays, now)?.toISOString()).toBe("2026-10-17T12:00:00.000Z");
    expect(newAccountUntil(snowflakeAt(new Date("2026-09-01T00:00:00Z")), now)).toBeNull();
    expect(newAccountUntil(null, now)).toBeNull();
    expect(newAccountMessage(new Date("2026-10-17T12:00:00Z"))).toBe("Your Discord account is new. You can list builds and upload images from 17 Oct 2026.");
  });
});
