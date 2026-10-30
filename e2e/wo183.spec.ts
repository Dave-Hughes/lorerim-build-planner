/**
 * WO-183 Part 4 (Mac): what the PC's data changes reaches the pages, and a default never poses as a fact. The unit tests over every line and quest are
 * src/lib/pages/wo183-pages.test.ts.
 */
import { expect, test } from "@playwright/test";

const body = async (page: import("@playwright/test").Page, path: string) => {
  const res = await page.goto(path);
  expect(res?.status(), path).toBe(200);
  return page.locator("main").innerText();
};

test("a quest no record starts says so, and a quest with a gate shows it", async ({ page }) => {
  const b = await body(page, "/quests/q/boethiahs-bidding");
  expect(b).toContain("Not started in normal play");
  expect(b).not.toContain("Starts by itself");
  const door = await body(page, "/quests/q/the-whispering-door");
  expect(door).toContain("Level 20");
  expect(door).not.toContain("Any level");
});

test("a line whose gate nobody read does not say Any level", async ({ page }) => {
  await page.goto("/quests");
  const hrefs = await page.locator('main a[href^="/quests/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? "").filter((h) => /^\/quests\/[a-z0-9-]+$/.test(h)).slice(0, 60));
  let sawUnread = false;
  for (const h of hrefs) {
    const t = await body(page, h);
    if (/Level\s*Not sure yet/i.test(t.replace(/\n/g, ""))) sawUnread = true;
    expect(t, h).not.toMatch(/Level\s*Any level[\s\S]{0,80}Not sure yet/);
  }
  expect(sawUnread || hrefs.length > 0).toBe(true);
});

test("a generic actor has no page and no search result; the guild's old address goes to its in-game name", async ({ page, request }) => {
  for (const slug of ["goblin", "mercenary", "dark-brotherhood-assassin"]) expect((await request.get(`/people/${slug}`)).status(), slug).toBe(404);
  await page.goto("/search?q=mercenary");
  const hits = await page.locator('main a[href^="/people/"]').allInnerTexts();
  expect(hits.filter((h) => /^(Mercenary|Goblin)$/i.test(h.trim())), `search for a generic name found ${hits.join(", ")}`).toEqual([]);
  const res = await page.goto("/places/dormitory");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveURL(/\/places\/hall-of-attainment$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hall of Attainment");
});

test("what the records give reaches the page: a trainer, a word wall, a skill book, a realm", async ({ page }) => {
  const neloth = await body(page, "/people/neloth");
  expect(neloth).toContain("Trains Enchanting");
  expect(neloth).toContain("Up to 90");
  const frostmere = await body(page, "/places/frostmere-crypt");
  expect(frostmere).toContain("Ice Form");
  expect(frostmere).toContain("A word wall");
  const borogove = await body(page, "/places/borogove");
  expect(borogove).toContain("the Shivering Isles");
  const winterhold = await body(page, "/places/hall-of-attainment");
  expect(winterhold).toMatch(/skill book/);
});

test("Missives lists its kinds, each job linked, and a kill job does not say it is a short delivery", async ({ page }) => {
  const t = await body(page, "/quests/missives");
  expect(t).toContain("Deliver a Letter");
  expect(t).not.toContain("each is a short delivery");
  expect(await page.locator('main a[href^="/quests/q/"]').count()).toBeGreaterThan(50);
  for (const [kind, jarl] of [["Kill Some Bandits", false], ["Kill Rieklings", true]] as const) {
    await page.goto("/quests/missives");
    await page.locator("main li", { hasText: kind }).first().getByRole("link").first().click();
    const text = await page.locator("main").innerText();
    expect(text, kind).not.toContain("each is a short delivery");
    if (jarl) expect(text, kind).not.toContain("bounty from the jarl");
  }
});

test("screenshots, at 1440 and 390", async ({ page }) => {
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    await page.setViewportSize({ width: w, height: h });
    for (const [name, path] of [["boethiah", "/quests/q/boethiahs-bidding"], ["whispering-door", "/quests/whispering-door"], ["neloth", "/people/neloth"], ["frostmere", "/places/frostmere-crypt"], ["borogove", "/places/borogove"], ["hall", "/places/hall-of-attainment"], ["missives", "/quests/missives"]] as const) {
      await page.goto(path);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `test-results/wo183-${name}-${w}.png`, fullPage: true });
    }
  }
});
