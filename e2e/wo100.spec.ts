/**
 * WO-100: the Quests pages (FEATURE_QUESTS on, the main server). Where you are is kept in the
 * browser, so each test starts from nothing entered.
 */
import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

async function setWhere(page: Page, level: string, main?: string, finished: string[] = []) {
  const where = page.getByRole("region", { name: "Where you are" });
  await where.getByRole("spinbutton", { name: "Your level" }).fill(level);
  if (main) await where.getByRole("combobox", { name: "Main quest, done up to" }).selectOption({ label: main });
  for (const f of finished) await where.getByRole("group", { name: "Finished" }).getByRole("button", { name: f }).click();
}

test("the home shows six categories and Jobs and errands; a level changes what's open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Quests" }).click();
  await expect(page).toHaveURL(/\/quests$/);
  await expect(page.getByRole("heading", { level: 1, name: "Quests" })).toBeVisible();
  const cats = page.locator('a[href^="/quests/c/"]');
  await expect(cats).toHaveCount(6);
  for (const name of ["Main stories", "Guilds and factions", "Daedric Princes", "New lands", "Side stories", "Followers"]) await expect(cats.filter({ hasText: name })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Jobs and errands" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Missives/ })).toBeVisible();

  // No level: just how many lines.
  const daedric = cats.filter({ hasText: "Daedric Princes" });
  await expect(daedric).toContainText(/\d+ quest lines/);
  await expect(daedric).not.toContainText("open to you");
  await setWhere(page, "22");
  await expect(daedric).toContainText(/\d+ open to you of \d+ quest lines/);
  const low = (await daedric.textContent())!.match(/(\d+) open to you/)![1];
  await setWhere(page, "30");
  await expect(daedric).not.toContainText(`${low} open to you`);
});

test("Daedric Princes at level 22 shows Ill Met By Moonlight as Opens at level 25", async ({ page }) => {
  await page.goto("/quests");
  await setWhere(page, "22");
  await page.locator('a[href="/quests/c/daedric-princes"]').click();
  await expect(page.getByRole("heading", { level: 1, name: "Daedric Princes" })).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Your level" })).toHaveValue("22");
  const card = page.getByRole("article", { name: "Ill Met By Moonlight" });
  await expect(card.getByText("Opens at level 25")).toBeVisible();
  await expect(card.getByText("Hircine")).toBeVisible();
  await card.getByRole("button", { name: "Tell me more" }).click();
  await expect(card.getByRole("term").filter({ hasText: "Needs" })).toBeVisible();
  await expect(card.getByText("Level 25.", { exact: true })).toBeVisible();
  // Only what I can start leaves it out.
  await page.getByLabel("Only what I can start").check();
  await expect(card).toHaveCount(0);
});

test("Wyrmstooth: level and main quest ticked, Rise in the East crossed, journals hidden until opened", async ({ page }) => {
  await page.goto("/quests/wyrmstooth");
  await expect(page.getByRole("heading", { level: 1, name: "Wyrmstooth" })).toBeVisible();
  await setWhere(page, "22", "The Way of the Voice", ["The Thieves Guild"]);
  const needs = page.getByRole("list", { name: "Needs" });
  const row = (t: string | RegExp) => needs.getByRole("listitem").filter({ hasText: t });
  await expect(row("Level 10").getByLabel("Done")).toBeVisible();
  await expect(row("Level 10")).toContainText("You're 22");
  await expect(row("The main quest through The Way of the Voice").getByLabel("Done")).toBeVisible();
  await expect(row("Rise in the East").getByLabel("Not yet")).toBeVisible();
  await expect(row("Rise in the East").getByRole("link", { name: "Rise in the East" })).toHaveAttribute("href", "/quests/rise-in-the-east");
  await expect(page.getByText("Not open to you yet.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do this first" })).toBeVisible();

  // The opening's journal is hidden until opened, the rest until asked for.
  const first = "An imperial courier named Theodyn Bienne has requested I speak to Lurius Liore";
  const quests = page.getByRole("region", { name: "Quests" });
  await expect(quests.getByText(first)).toHaveCount(0);
  const opening = quests.getByRole("listitem").filter({ hasText: "Starts here" });
  await opening.getByRole("button", { name: "Journal ›" }).click();
  await expect(quests.getByText(first)).toBeVisible();
  await expect(opening.getByRole("button", { name: /^Show the next \d+ entr/ })).toBeVisible();
  await expect(opening.getByText("These give the story away")).toBeVisible();
});

test("Blood on the Ice: How it can end stays closed until asked for, then gives both endings", async ({ page }) => {
  await page.goto("/quests/blood-on-the-ice");
  const quest = page.locator("#q-MS11");
  await quest.getByRole("button", { name: "Journal ›" }).click();
  const ends = quest.locator("details", { hasText: "How it can end" });
  await expect(ends).not.toHaveAttribute("open", "");
  await expect(quest.getByText("Calixto Corrium was the Butcher of Windhelm")).toBeHidden();
  await ends.getByText("How it can end").click();
  await expect(quest.getByText("Wuunferth the Unliving was the Butcher of Windhelm")).toBeVisible();
  await expect(quest.getByText("Calixto Corrium was the Butcher of Windhelm")).toBeVisible();
});

test("a link to #end-<quest> opens its row with How it can end still closed", async ({ page }) => {
  await page.goto("/quests/dark-brotherhood#end-DB01");
  const ends = page.locator("#end-DB01");
  await expect(ends).toBeVisible();
  await expect(ends).not.toHaveAttribute("open", "");
  await expect(page.getByText("I killed Grelod the Kind")).toBeHidden();
});
