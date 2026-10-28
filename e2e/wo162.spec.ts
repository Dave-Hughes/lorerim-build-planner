/**
 * WO-162: a place's page fits what the place is: a town (Riverwood) is the PlaceTown board, an inn inside one is the same page smaller, and a
 * dangerous place keeps its danger, boss and clearing, with an At a glance band; what people say shows only what is tied to a quest.
 */
import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`Riverwood at ${width}: no danger, boss, clearing XP or comes-back; who lives here by building with their roles and chips; close by with levels`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places/riverwood");
    await expect(page.getByRole("heading", { level: 1, name: "Riverwood" })).toBeVisible();
    const glance = page.getByRole("region", { name: "At a glance" });
    for (const w of ["Where", "People", "Shops and beds", "Trainers and followers", "Finding it"]) await expect(glance).toContainText(w);
    await expect(glance).toContainText("Whiterun hold");
    for (const bad of [/Its boss is/, /For clearing it/, /Comes back/, /The boss/]) await expect(page.locator("main")).not.toContainText(bad);
    await expect(page.getByRole("region", { name: "Danger" })).toHaveCount(0);
    const people = page.getByRole("region", { name: "Who lives here" });
    await expect(people).toContainText("Riverwood Trader");
    await expect(people.getByRole("link", { name: "Lucan Valerius" })).toHaveAttribute("href", "/people/lucan-valerius");
    await expect(people).toContainText("General goods merchant");
    await expect(people.getByText("Sells").first()).toBeVisible();
    await expect(people.getByText("Trains Marksman")).toBeVisible();
    await expect(people.getByText("Follower").first()).toBeVisible();
    await expect(people.getByText("Rents rooms", { exact: true }).first()).toBeVisible();
    await expect(people.getByText(/Gives (a quest|quests)/).first()).toBeVisible();
    // The Sleeping Giant Inn is a building with a page of its own.
    await expect(people.getByRole("link", { name: "Sleeping Giant Inn" })).toHaveAttribute("href", "/places/sleeping-giant-inn");
    const close = page.getByRole("region", { name: "Close by" });
    await expect(close.getByRole("link", { name: "Bleak Falls Barrow" })).toBeVisible();
    await expect(close).toContainText(/Level \d+ to \d+/);
    // Helgen once, though two records have its name.
    await expect(close.getByRole("link", { name: "Helgen" })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo162-riverwood-${width}.png`, fullPage: true });
  });
}

test("a place's quests never show an editor id or a mod's bookkeeping", async ({ page }) => {
  await page.goto("/places/riverwood");
  const quests = page.getByRole("region", { name: "Quests that bring you here" });
  await expect(quests.getByRole("link", { name: "The Golden Claw" })).toBeVisible();
  await expect(quests).not.toContainText(/ANDR_|_VendorQuest|BCSLL|Vendor Quest/);
});

test("the Sleeping Giant Inn is the same page, smaller: its keeper first, what you can make, its quests, and a way up to Riverwood", async ({ page }) => {
  await page.goto("/places/sleeping-giant-inn");
  await expect(page.getByRole("link", { name: "Back to Riverwood" })).toHaveAttribute("href", "/places/riverwood");
  const here = page.getByRole("region", { name: "Who is here" });
  const names = await here.locator("a").allInnerTexts();
  // The keepers first: Delphine, whose read gives her the inn, and Orgnar, whose record does.
  expect(names.slice(0, 2).sort()).toEqual(["Delphine", "Orgnar"]);
  await expect(here).toContainText("Rents rooms");
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("What you can make");
  await expect(page.getByRole("region", { name: "Crafting and shrines" })).toContainText(/alchemy lab/i);
  await expect(page.getByRole("region", { name: "Quests that bring you here" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Danger" })).toHaveCount(0);
  await page.screenshot({ path: "test-results/wo162-sleeping-giant-inn-1440.png", fullPage: true });
});

for (const width of [1440, 390]) {
  test(`Bleak Falls Barrow at ${width} keeps its danger, boss, rewards and comes-back, now with the At a glance band`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places/bleak-falls-barrow");
    const glance = page.getByRole("region", { name: "At a glance" });
    for (const w of ["Danger", "The boss", "Rewards", "Comes back", "Nearest town"]) await expect(glance).toContainText(w);
    await expect(glance).toContainText("Level 6 to 20");
    await expect(glance).toContainText("Zulakaroth");
    await expect(glance).toContainText("200 XP");
    await expect(page.getByRole("region", { name: "Danger" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo162-bleak-falls-barrow-${width}.png`, fullPage: true });
  });
}

test("what people say about it shows what is tied to a quest and its books and notes, five at most, and the rest behind All N lines", async ({ page }) => {
  await page.goto("/places/riverwood");
  const said = page.getByRole("region", { name: "What people say about it" });
  await expect(said.locator("blockquote, p[class*=quote]")).toHaveCount(await said.locator("p[class*=quote]").count());
  const shown = await said.locator(":scope > div[class*=said]").count();
  expect(shown).toBeGreaterThan(0);
  expect(shown).toBeLessThanOrEqual(5);
  await expect(said.getByText(/All \d+ lines?, greetings included/)).toBeVisible();
  await expect(said.getByRole("link", { name: "Delphine" }).first()).toHaveAttribute("href", "/people/delphine");
  await expect(said.getByText("in ").first()).toBeVisible();
});

test("review: Riverwood lists everyone who sleeps there, names every kind of shop, and gives Delphine the Rents rooms chip", async ({ page }) => {
  await page.goto("/places/riverwood");
  const people = page.getByRole("region", { name: "Who lives here" });
  for (const n of ["Sven", "Hod", "Sigrid", "Embry", "Dorthe", "Alvor"]) await expect(people.getByRole("link", { name: n, exact: true }).first()).toBeVisible();
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText(/blacksmith/i);
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText(/general goods/i);
  const delphine = people.locator("span", { has: page.getByRole("link", { name: "Delphine", exact: true }) }).first();
  await expect(delphine).toContainText("Rents rooms");
  await expect(page.getByRole("region", { name: "Information Confidence" })).not.toContainText(/the boss/i);
});

test("review: High Hrothgar is the Greybeards' home, with the trolls said in the band and no boss or comes-back", async ({ page }) => {
  await page.goto("/places/high-hrothgar");
  await expect(page.getByRole("heading", { level: 1, name: "High Hrothgar" })).toBeVisible();
  const people = page.getByRole("region", { name: "Who lives here" });
  await expect(people.getByRole("link", { name: "Arngeir" })).toBeVisible();
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText(/Trolls on the path up/);
  for (const bad of [/The Beast/, /Comes back/]) await expect(page.locator("main")).not.toContainText(bad);
});

test("review: a dangerous place says each thing once, the rail is the contents only, and 'an' goes before a vowel", async ({ page }) => {
  await page.goto("/places/bleak-falls-barrow");
  const main = page.locator("main");
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Danger");
  await expect(main.getByRole("heading", { name: "Danger" })).toHaveCount(0);
  await expect(main.getByRole("heading", { name: "Good to know" })).toHaveCount(0);
  await expect(page.getByRole("complementary").getByRole("heading")).toHaveCount(0);
  await expect(main.getByText("For finding it")).toHaveCount(1);
  await expect(main).not.toContainText(/\bA (Alchemy|Enchanting|Illusion|Alteration|Archery|Armor) skill book/);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "test-results/wo162-bleak-falls-1440.png", fullPage: true });
  await page.goto("/places/riverwood");
  await page.screenshot({ path: "test-results/wo162-riverwood-1440.png", fullPage: true });
  await page.goto("/places/high-hrothgar");
  await page.screenshot({ path: "test-results/wo162-high-hrothgar-1440.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ["riverwood", "high-hrothgar", "bleak-falls-barrow"]) {
    await page.goto(`/places/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), slug).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo162-${slug}-390.png`, fullPage: true });
  }
});

test("review: Dragonsreach shows the same quote once", async ({ page }) => {
  await page.goto("/places/dragonsreach");
  // The five shown, not the full list folded under them (which holds the same five again).
  const quotes = await page.locator("#said > div [class*='quote']").allInnerTexts();
  expect(new Set(quotes.map((q) => q.replace(/\s+/g, " ").trim().toLowerCase())).size).toBe(quotes.length);
});
