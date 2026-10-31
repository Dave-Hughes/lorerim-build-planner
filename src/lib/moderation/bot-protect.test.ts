import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOT_PROTECTED, botPathMatches, isBotProtected } from "./protect";

/**
 * WO-185 Part 1: the third time a new write route was missed (sign-in and Import a build were the first two; WO-184's uploads the third). Every page and every route that asks
 * `looksLikeBot()` must be on BotID's protect list, or its POST reads as a bot.
 */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** A file's address: route groups in brackets drop out, [id] and [...rest] become a name. */
const addressOf = (file: string) =>
  "/" +
  path
    .relative("src/app", path.dirname(file))
    .split(path.sep)
    .filter((s) => s && !/^\(.*\)$/.test(s))
    .map((s) => s.replace(/^\[\[?\.\.\.(\w+)\]\]?$/, "x").replace(/^\[(\w+)\]$/, "x"))
    .join("/");

const files = walk("src/app");
const pages = files.filter((f) => f.endsWith("/page.tsx")).map(addressOf);
const routes = files.filter((f) => f.endsWith("/route.ts"));

describe("BotID's protect list", () => {
  it("covers every page, since a server action posts to its page and every page's header has the sign-in button", () => {
    const missing = pages.filter((p) => !isBotProtected(p));
    expect(missing, `pages whose POSTs would read as a bot: add them to src/lib/moderation/protect.ts`).toEqual([]);
  });
  it("covers every route that asks looksLikeBot()", () => {
    const checked = routes.filter((f) => /looksLikeBot/.test(readFileSync(f, "utf8"))).map(addressOf);
    expect(checked.length).toBeGreaterThan(1);
    const missing = checked.filter((p) => !isBotProtected(p));
    expect(missing, `routes that ask looksLikeBot() but aren't on the list`).toEqual([]);
    expect(checked).toEqual(expect.arrayContaining(["/api/screenshots", "/api/tips"]));
  });
  it("leaves out the guide's autosave, which BotID's client can't sign as the page closes", () => {
    expect(isBotProtected("/api/builds/abc/guide")).toBe(false);
    expect(isBotProtected("/api/builds/abc/images")).toBe(true);
  });
  it("matches as BotID does", () => {
    expect(botPathMatches("/b/*", "/b/abc/edit")).toBe(true);
    expect(botPathMatches("/quests", "/quests/x")).toBe(false);
    expect(BOT_PROTECTED.every((p) => p.method === "POST")).toBe(true);
  });
});
