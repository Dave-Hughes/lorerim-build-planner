/**
 * WO-181: the Playthrough tab opens on who she is and how she plays with a Begin Act I panel; each act has its At a glance band, steps with the
 * stop's number and an own map of numbered pins; a character with nothing written opens on Act I; the Story and progress tracking are retired;
 * set_theme writes who she is and refuses what breaks the writing rules. (Progress tracking on: wo181-tracking.spec.ts.)
 */
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

const PLAY = `/b/${KYRIA_BUILD_ID}?tab=playthrough`;
const shot = (page: Page, name: string) => page.screenshot({ path: `test-results/wo181-${name}.png`, fullPage: true });

test.describe.configure({ mode: "serial" });

/** A character with nothing written about her, made through the door: one act with no route, one with a route. */
let bare: { pt: string; buildId: string } | null = null;
async function shell(page: Page, context: BrowserContext, baseURL: string) {
  if (bare) return bare;
  const from = ip();
  const token = (await tokenFor(page, context, baseURL, from)).access_token;
  const go = (n: string, args: object) => call(baseURL, from, token, n, args);
  const created = await go("create_playthrough", { name: "E2E Bare Character" });
  expect(created.isError, created.text).toBe(false);
  const pt = created.json().playthrough as string;
  const one = await go("add_act", { playthrough: pt, name: "The first days", levels: "1 to 5", place: "Riverwood", goal: "Get to Riverwood alive." });
  expect(one.isError, one.text).toBe(false);
  await page.goto(`/p/${pt}`);
  await page.waitForURL(/\/b\/[^/]+\?tab=playthrough/);
  bare = { pt, buildId: /\/b\/([^/?]+)/.exec(page.url())![1] };
  return bare;
}

for (const width of [1440, 390]) {
  test(`opens on who she is at ${width}: the backstory, From, Gods and Goal, how she plays, and Begin Act I`, async ({ page, context }) => {
    await signIn(context);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PLAY);
    await expect(page.getByRole("heading", { level: 2, name: "Who she is" })).toBeVisible();
    // The first two paragraphs, then Read all of it.
    await expect(page.getByText("Kyria was left as a baby at Dibella's chapel in Anvil", { exact: false })).toBeVisible();
    await expect(page.getByText("At nineteen, slavers from a Stros M'Kai galley")).toHaveCount(0);
    await page.waitForTimeout(800);
    await shot(page, `who-closed-${width}`);
    await page.getByRole("button", { name: "Read all of it ›" }).click();
    await expect(page.getByText("At nineteen, slavers from a Stros M'Kai galley")).toBeVisible();
    await shot(page, `who-open-${width}`);
    await page.getByRole("button", { name: "Less ›" }).click();
    // The fact row, only the filled ones.
    const facts = page.locator("main").getByText("Anvil, raised at Dibella's chapel");
    await expect(facts).toBeVisible();
    await expect(page.getByText("Stendarr, and Dibella")).toBeVisible();
    await expect(page.getByText("Find Pia, and the man with the rings")).toBeVisible();
    // How she plays: three columns in three colours' words.
    const plays = page.getByRole("region", { name: "How she plays" });
    await expect(plays.getByText("She will", { exact: true })).toBeVisible();
    await expect(plays.getByText("She won't", { exact: true })).toBeVisible();
    await expect(plays.getByText("Grey areas", { exact: true })).toBeVisible();
    await expect(plays.getByText("Steal from homes, farms or shops")).toBeVisible();
    // The loudest thing on the page: the whole panel is the click.
    const begin = page.getByRole("link", { name: /^Begin Act I, The Sister's House/ });
    await expect(begin).toBeVisible();
    await expect(begin).toContainText("Begin Act I ›");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    // No done counts, no read times, no where-she-is.
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\d+ of \d+ done|\bmin read|minutes? to read|Where is she in your game/i);
    await begin.click();
    await expect(page).toHaveURL(/act=1$/);
    await expect(page.getByRole("heading", { level: 2, name: "The Sister's House" })).toBeVisible();
  });
}

test("the rail switches between who she is and her acts without leaving the page", async ({ page, context }) => {
  await signIn(context);
  await page.goto(PLAY);
  const rail = page.getByRole("complementary").filter({ has: page.getByRole("heading", { name: "Acts" }) });
  await expect(rail.getByRole("link", { name: /^Who she is/ })).toHaveAttribute("aria-current", "true");
  await rail.getByRole("link", { name: /II The Bard's Road/ }).click();
  await expect(page).toHaveURL(/tab=playthrough&act=2$/);
  await expect(page.getByRole("heading", { level: 2, name: "The Bard's Road" })).toBeVisible();
  await expect(rail.getByRole("link", { name: /II The Bard's Road/ })).toHaveAttribute("aria-current", "true");
  await rail.getByRole("link", { name: /^Who she is/ }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Who she is" })).toBeVisible();
  // ?act=N opens act N on a fresh load.
  await page.goto(`${PLAY}&act=3`);
  await expect(page.getByRole("heading", { level: 2, name: "The Winking Skeever" })).toBeVisible();
});

for (const width of [1440, 390]) {
  test(`an act at ${width}: the At a glance band, steps at their stops, and a map whose pins are the steps' numbers`, async ({ page, context }) => {
    await signIn(context);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${PLAY}&act=2`);
    const band = page.getByRole("heading", { level: 2, name: "The Bard's Road" });
    await expect(band).toBeVisible();
    await expect(page.getByText("Where it takes her")).toBeVisible();
    await expect(page.getByText("Riften to Solitude")).toBeVisible();
    await expect(page.getByText("By Ivarstead and Whiterun")).toBeVisible();
    // The first stop and the last are linked in the band's step; the step at Ivarstead is stop 2 and its why line is under it.
    const map = page.getByRole("group", { name: "Map of Act II, The Bard's Road" });
    await expect(map).toBeVisible();
    await page.waitForTimeout(1500);
    const pins = await map.locator("i").allInnerTexts();
    expect(pins).toEqual(["1", "2", "3", "4"]);
    await expect(map.getByText("Carriage")).toBeVisible();
    await expect(map.getByText("On foot")).toBeVisible();
    await expect(map.getByRole("link", { name: "Open on the map ›" })).toHaveAttribute("href", /\/map\?stops=.+&route=/);
    await expect(map.getByRole("link", { name: /Skyrim Paper Map by Caro Tuts/ })).toBeVisible();
    // The step's number is its stop's, and hovering the step lights the pin.
    const step = page.locator("[id^=o]").filter({ hasText: "Sing at the Vilemyr Inn" });
    await expect(step.locator("span").first()).toHaveText("2");
    if (width > 1100) {
      await step.hover();
      await expect(map.locator("[class*='hot']")).toHaveCount(1);
      await expect(map.locator("[class*='hot'] i")).toHaveText("2");
      expect((await map.boundingBox())!.width).toBeGreaterThan(480);
    } else {
      expect((await map.boundingBox())!.height).toBeLessThanOrEqual(330);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.waitForTimeout(500);
    await shot(page, `act2-${width}`);
    // Act I: no step is ticked or counted, and nothing says done.
    await page.goto(`${PLAY}&act=1`);
    await expect(page.getByRole("heading", { level: 2, name: "The Sister's House" })).toBeVisible();
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await page.waitForTimeout(1500);
    await shot(page, `act1-${width}`);
  });
}

test("an act with no route and no linked place has no map, and its steps take the width", async ({ page, context }) => {
  await signIn(context);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${PLAY}&act=3`);
  await expect(page.getByRole("heading", { level: 2, name: "The Winking Skeever" })).toBeVisible();
  await expect(page.getByRole("group", { name: /^Map of Act/ })).toHaveCount(0);
  await shot(page, "act-no-route-1440");
});

test("a character with nothing written about her opens on Act I, and its owner is asked to write who she is", async ({ page, context, baseURL }) => {
  await signIn(context);
  const { buildId } = await shell(page, context, baseURL!);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/b/${buildId}?tab=playthrough`);
  await expect(page.getByRole("heading", { level: 2, name: "The first days" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Who she is" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /^Write who they are ›/ })).toHaveAttribute("href", `/b/${buildId}/edit/play#who`);
  await shot(page, "no-theme-1440");
  // A visitor sees neither the card nor the ask.
  await context.clearCookies();
  await page.goto(`/b/${buildId}`);
  await expect(page.getByRole("link", { name: /^Write who/ })).toHaveCount(0);
});

test("set_theme writes who she is, refuses a line that breaks a rule and says why, and get_playthrough gives it back", async ({ page, context, baseURL }) => {
  await signIn(context);
  const { pt } = await shell(page, context, baseURL!);
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (n: string, args: object) => call(baseURL!, from, token, n, args);
  for (const [bad, why] of [
    [{ backstory: "She left Anvil — in a hurry." }, "em dash"],
    [{ from: "Anvil · Dibella's chapel".replace("·", "·") }, "isn't used here"],
    [{ goal: "Find Pia \u{1F5E1}" }, "no emoji"],
    [{ will: ["Steal: only from the rich"] }, "colon"],
    [{ grey: ["x".repeat(91)] }, "91 characters; the most is 90"],
    [{ gods: "y".repeat(81) }, "81 characters; the most is 80"],
  ] as const) {
    const r = await go("set_theme", { playthrough: pt, ...bad });
    expect(r.isError, JSON.stringify(bad)).toBe(true);
    expect(r.text).toContain(why);
  }
  const ok = await go("set_theme", {
    playthrough: pt,
    backstory: "She was raised in Anvil.\n\nShe left for Skyrim to find her sister.",
    from: "Anvil",
    gods: "Dibella",
    goal: "Find her sister",
    will: ["Work inn shifts"],
    never: ["Steal from homes, farms or shops"],
    grey: ["Loot bandit camps"],
  });
  expect(ok.isError, ok.text).toBe(false);
  expect(ok.json().who).toMatchObject({ from: "Anvil", gods: "Dibella", goal: "Find her sister", will: ["Work inn shifts"], never: ["Steal from homes, farms or shops"], grey: ["Loot bandit camps"] });
  const got = (await go("get_playthrough", { playthrough: pt })).json();
  expect(got.who.backstory).toBe("She was raised in Anvil.\n\nShe left for Skyrim to find her sister.");
  expect(got).not.toHaveProperty("chapters");
  expect(got).not.toHaveProperty("done");
  // The character now opens on who she is.
  await page.goto(`/p/${pt}`);
  // A character with no pronouns set is "they" (WO-179).
  await expect(page.getByRole("heading", { level: 2, name: "Who they are" })).toBeVisible();
  await expect(page.getByText("Loot bandit camps")).toBeVisible();
  // Tracking is off: set_status and set_snapshot answer that.
  const off = await go("set_status", { playthrough: pt, objective: "1", status: "done" });
  expect(off.text).toBe("Progress tracking is off for now.");
});

test("the editor writes who she is: the count, the writing rules as you type, and a list you add to", async ({ page, context, baseURL }) => {
  await signIn(context);
  const { buildId } = await shell(page, context, baseURL!);
  await page.goto(`/b/${buildId}/edit/play`);
  const who = page.getByRole("region", { name: /^Write who/ });
  await expect(who).toBeVisible();
  await expect(who.getByText(/\d+ of 3000 characters/)).toBeVisible();
  await who.getByLabel("From", { exact: true }).fill("Anvil — a port");
  await expect(who.getByRole("alert")).toContainText("em dash");
  await who.getByLabel("From", { exact: true }).fill("Skingrad");
  await who.getByLabel("From", { exact: true }).blur();
  await who.getByRole("button", { name: "+ Add a line" }).first().click();
  await who.getByLabel(/will, line \d+$/).last().fill("Sing: for coin");
  await expect(who.getByRole("alert")).toContainText("colon");
});

test("the Story is gone: its addresses go to the Playthrough tab, and nothing says done, a read time or where she is", async ({ page, context }) => {
  await signIn(context);
  for (const old of [`/b/${KYRIA_BUILD_ID}/story`, `/b/${KYRIA_BUILD_ID}/story/1`, `/p/${KYRIA_PLAYTHROUGH_ID}/story/1`, `/p/${KYRIA_PLAYTHROUGH_ID}/tale`]) {
    await page.goto(old);
    await expect(page, old).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough$|/b/${KYRIA_BUILD_ID}$`));
  }
  await page.goto(PLAY);
  await expect(page.getByRole("link", { name: /Read the story/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /^Story/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /^Playthrough/ })).toContainText("5 acts");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/\d+ of \d+ done|Where is she in your game|\bmin read\b|Her story|Update ›|Read a save/);
  // The map shows no character's pin: its address is ignored.
  await page.goto("/map?character=abc");
  await expect(page.getByRole("group", { name: "Map of Skyrim" })).toBeVisible();
});
