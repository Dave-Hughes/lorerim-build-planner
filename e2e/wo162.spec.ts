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
    await expect(people).toContainText("general goods merchant");
    await expect(people.getByText("Sells").first()).toBeVisible();
    await expect(people.getByText("Trains Marksman")).toBeVisible();
    await expect(people.getByText("Follower").first()).toBeVisible();
    await expect(people.getByText("Rents rooms", { exact: true })).toBeVisible();
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
  expect(names[0]).toBe("Orgnar");
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
