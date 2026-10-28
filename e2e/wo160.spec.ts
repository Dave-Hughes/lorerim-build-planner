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
    await expect(story.getByText("Starts here")).toHaveCount(0);
    await expect(story.getByText("A choice", { exact: true })).toHaveCount(0);
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
  // Every category but Main stories is a table (WO-163): one row per quest or line, no cards.
  await page.goto("/quests/c/guilds-and-factions");
  await expect(page.locator("main table tbody tr").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Tell me more/ })).toHaveCount(0);
  await page.goto("/quests/c/side-stories");
  await expect(page.getByRole("columnheader", { name: "Quest XP" })).toBeVisible();
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

test("Part 4: Dragonborn's seven quests, no empty rows, one button label", async ({ page }) => {
  await page.goto("/quests/dragonborn");
  const story = page.getByRole("region", { name: "The story" });
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("7 quests");
  await expect(page.locator("main").getByText("8 quests")).toHaveCount(0);
  await expect(story.getByRole("link", { name: "Cultists vs Player" })).toHaveCount(0);
  await expect(page.locator("main")).toContainText("Not counted as a step: Cultists vs Player");
  for (const li of await page.getByRole("region", { name: "At a glance" }).getByRole("listitem").all()) expect((await li.innerText()).trim().length).toBeGreaterThan(0);
  await page.screenshot({ path: "test-results/wo160-dragonborn-1440.png", fullPage: true });
  await page.goto("/quests/c/main-stories");
  await expect(page.getByRole("link", { name: "Open the story ›" })).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Open ›", exact: true })).toHaveCount(0);
  await expect(page.locator("main").getByText("7 quests").first()).toBeVisible();
});

test("Part 5: less on the page, names linked in their sentence, the rail is the contents only, Opens other stories in the column, and one XP", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/main-quest");
    const story = page.getByRole("region", { name: "The story" });
    // No Starts here or A choice chip, and no person or place chip under a quest.
    await expect(story.locator('[class*="__chip"]').filter({ hasText: /Starts here|A choice/ })).toHaveCount(0);
    await expect(story.locator('[class*="__who"], [class*="__place"]')).toHaveCount(0);
    // "Talk to Alvor or Gerdur in Riverwood": the names are links where they are written.
    const before = story.getByText("Talk to Alvor or Gerdur in Riverwood").first();
    await expect(before.getByRole("link", { name: "Riverwood" })).toHaveAttribute("href", /\/places\/riverwood/);
    await expect(before.getByRole("link", { name: "Alvor" }).or(before.getByRole("link", { name: "Gerdur" })).first()).toHaveAttribute("href", /\/people\//);
    // The rail is the contents only; Opens other stories is a section of the column.
    await expect(page.getByRole("complementary").getByRole("heading")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Opens other stories" })).toBeVisible();
    await expect(page.getByRole("region", { name: "How it starts" })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo160-main-quest-${width}.png`, fullPage: true });
  }
  // Quest XP says one thing: the story's XP, and under it what the jobs along the way pay; Along the way says the same.
  await page.goto("/quests/companions");
  const glance = page.getByRole("region", { name: "At a glance" });
  await expect(glance).toContainText("Quest XP");
  await expect(glance).toContainText(/Jobs along the way pay 100 each/);
  await expect(page.getByRole("region", { name: "Along the way" })).toContainText("They pay 100 each");
  await expect(page.getByRole("region", { name: "Along the way" })).not.toContainText("no quest XP");
});

test("Part 6: short names, a leading The, bracketed quests, Opens other stories, and one answer for each fact", async ({ page }) => {
  await page.goto("/quests/main-quest");
  const story = page.getByRole("region", { name: "The story" });
  await expect(story.getByRole("link", { name: "Farengar", exact: true }).first()).toHaveAttribute("href", "/people/farengar-secret-fire");
  await expect(story.getByRole("link", { name: /^(Jarl )?Balgruuf/ }).first()).toHaveAttribute("href", "/people/balgruuf-the-greater");
  const gives = page.getByRole("region", { name: "What the whole line gives" });
  await expect(gives.getByRole("link", { name: "The Throat of the World" })).toHaveAttribute("href", /\/quests\/q\//);
  await expect(gives.getByRole("link", { name: "A Blade in the Dark" })).toHaveAttribute("href", /\/quests\/q\//);
  await expect(gives.getByRole("link", { name: "Jurgen Windcaller", exact: true })).toHaveCount(0);
  const closes = page.getByRole("region", { name: "What it closes" });
  await expect(closes.getByRole("link", { name: "Paarthurnax" })).toHaveCount(2);
  await expect(closes.getByRole("link", { name: "Paarthurnax" }).last()).toHaveAttribute("href", /\/quests\/q\//);
  await expect(page.getByRole("region", { name: "At a glance" })).not.toContainText("gives no item");
  // Not sure yet lists only what the second reader could not settle; this line was read and checked.
  await expect(page.getByRole("region", { name: "Information Confidence" })).not.toContainText(/the order of its quests/);
  await page.goto("/quests/dragonborn");
  const glance = page.getByRole("region", { name: "At a glance" });
  await expect(glance).toContainText("Level 25");
  await expect(page.locator("main")).not.toContainText("no level for it");
  const where = (await glance.getByText("Where it takes you").locator("xpath=following-sibling::span[1]").innerText()).split(/,\s*|\s+and\s+/);
  const names = where.map((w) => w.replace(/\d+ more$/, "").trim()).filter(Boolean);
  expect(new Set(names).size).toBe(names.length);
  const opens = page.getByRole("region", { name: "Opens other stories" });
  if (await opens.count()) await expect(opens.getByRole("link").first()).toBeVisible();
  await page.goto("/quests/dawnguard");
  await expect(page.locator('main a[href="/people/silver-hand"]')).toHaveCount(0);
  const volk = page.locator("main").getByRole("link", { name: /Volkihar/ });
  if (await volk.count()) await expect(volk.first()).toHaveAttribute("href", /\/places\/castle-volkihar/);
  for (const p of ["main-quest", "dragonborn", "dawnguard", "companions"]) {
    await page.goto(`/quests/${p}`);
    await page.screenshot({ path: `test-results/wo160-${p}-1440.png`, fullPage: true });
  }
});
