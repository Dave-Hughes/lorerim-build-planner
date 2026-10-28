/**
 * WO-160: one page per quest line, built from the LinePage board; the category pages as rows; the old story addresses redirect.
 */
import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`the main quest at ${width}: the story's name is the title, the line's name a tag, the band, the chapters, Along the way and the rail`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/main-quest");
    await expect(page.getByRole("heading", { level: 1, name: "Become the Dragonborn" })).toBeVisible();
    await expect(page.locator("main").getByText("The main quest", { exact: true }).first()).toBeVisible();
    const band = page.getByRole("region", { name: "At a glance" });
    for (const w of ["How it starts", "Level", "Length", "Quest XP", "Where it takes you"]) await expect(band).toContainText(w);
    await expect(band).toContainText("Escape Helgen");
    await expect(band).toContainText("3,800");
    const story = page.getByRole("region", { name: "The story" });
    await expect(story.getByRole("link", { name: "Unbound" })).toHaveAttribute("href", /\/quests\/q\/unbound/);
    await expect(story.getByText("Starts here")).toBeVisible();
    await expect(story.getByRole("link", { name: "Helgen" }).first()).toBeVisible();
    await expect(page.getByRole("region", { name: "Along the way" }).getByRole("link", { name: "Dragon Research" })).toBeVisible();
    await expect(page.getByRole("region", { name: "What the whole line gives" })).toBeVisible();
    await expect(page.getByRole("region", { name: "What it closes" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Information Confidence" })).toBeVisible();
    // The page's order: the band under the title, then the story, Along the way, what it gives and closes, then Information Confidence.
    const heads = (await page.locator("main h2").allInnerTexts()).map((t) => t.toLowerCase());
    const at = (t: string) => heads.findIndex((h) => h.includes(t));
    expect([at("at a glance"), at("the story"), at("along the way"), at("what the whole line gives"), at("what it closes"), at("information confidence")].filter((n) => n >= 0)).toEqual([...heads.keys()].filter((i) => ["the story", "along the way", "what the whole line gives", "what it closes", "information confidence"].some((t) => heads[i].includes(t))));
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo160-main-quest-${width}.png`, fullPage: true });
  });
}

test("Hide what's ahead keeps the first chapter and hides the names and quests after it, and is remembered", async ({ page }) => {
  await page.goto("/quests/main-quest");
  const story = page.getByRole("region", { name: "The story" });
  await expect(story.getByText("The Dragonstone")).toBeVisible();
  await page.getByRole("switch", { name: "Hide what's ahead" }).click();
  await expect(story.getByText("Escape Helgen")).toBeVisible();
  await expect(story.getByRole("link", { name: "Unbound" })).toBeVisible();
  await expect(story.getByText("The Dragonstone")).toHaveCount(0);
  await expect(story.getByRole("link", { name: "Bleak Falls Barrow" })).toHaveCount(0);
  await expect(story.getByText("Chapter 2", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("switch", { name: "Hide what's ahead" })).toHaveAttribute("aria-checked", "true");
  await expect(story.getByText("The Dragonstone")).toHaveCount(0);
  await page.getByRole("switch", { name: "Hide what's ahead" }).click();
  await expect(story.getByText("The Dragonstone")).toBeVisible();
});

test("Dawnguard shows both sides as two runs after the shared start", async ({ page }) => {
  await page.goto("/quests/dawnguard");
  await expect(page.getByRole("heading", { level: 1, name: "Join the Dawnguard" })).toBeVisible();
  const story = page.getByRole("region", { name: "The story" });
  await expect(story.getByText("On the Dawnguard side")).toBeVisible();
  await expect(story.getByText("In Harkon's court")).toBeVisible();
  await expect(story.getByRole("link", { name: "A New Order" })).toBeVisible();
  await expect(story.getByRole("link", { name: "The Bloodstone Chalice" })).toBeVisible();
  await page.screenshot({ path: "test-results/wo160-dawnguard-1440.png", fullPage: true });
});

test("a line with no story is its quests in order as one run, and a shelf is its jobs by where you pick them up", async ({ page }) => {
  await page.goto("/quests/thieves-guild");
  await expect(page.getByRole("region", { name: "At a glance" })).toBeVisible();
  await expect(page.getByRole("region", { name: "The story" }).getByRole("link").first()).toBeVisible();
  await page.goto("/quests/capital-whiterun");
  await expect(page.getByRole("region", { name: "Jobs" })).toBeVisible();
  await expect(page.getByText("Not listed")).toHaveCount(0);
});

test("the old story addresses land on the line's page", async ({ page }) => {
  await page.goto("/quests/s/become-the-dragonborn");
  await expect(page).toHaveURL(/\/quests\/main-quest$/);
  await page.goto("/quests/s/join-the-dawnguard");
  await expect(page).toHaveURL(/\/quests\/dawnguard$/);
  expect((await page.goto("/quests/s/not-a-story"))?.status()).toBe(404);
});

test("Main stories is the three stories in order, numbered, then the mods' quests tied to them; no Tell me more", async ({ page }) => {
  await page.goto("/quests/c/main-stories");
  await expect(page.getByRole("heading", { level: 1, name: "Main stories" })).toBeVisible();
  const rows = page.locator("main article h2");
  await expect(rows).toHaveText(["Become the Dragonborn", "Dragonborn", "Join the Dawnguard"]);
  await expect(page.getByRole("link", { name: "Become the Dragonborn" })).toHaveAttribute("href", "/quests/main-quest");
  await expect(page.getByRole("heading", { name: "Tied to these stories" })).toBeVisible();
  await expect(page.getByRole("link", { name: "A Forgotten Blade" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Tell me more/ })).toHaveCount(0);
  await page.screenshot({ path: "test-results/wo160-main-stories-1440.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/wo160-main-stories-390.png", fullPage: true });
});

test("another category takes the same rows, with its single quests after them", async ({ page }) => {
  await page.goto("/quests/c/guilds-and-factions");
  await expect(page.locator("main article h2").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Tell me more/ })).toHaveCount(0);
  await page.goto("/quests/c/side-stories");
  await expect(page.getByRole("heading", { name: "Single quests" })).toBeVisible();
});

for (const [slug, title] of [
  ["dragonborn", "Dragonborn"],
  ["wyrmstooth", "Wyrmstooth"],
] as const) {
  test(`${title} at 1440 and 390 has the one page`, async ({ page }) => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/quests/${slug}`);
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
      await expect(page.getByRole("region", { name: "At a glance" })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${slug} at ${width}`).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `test-results/wo160-${slug}-${width}.png`, fullPage: true });
    }
  });
}
