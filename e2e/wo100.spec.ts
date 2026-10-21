/**
 * WO-100: the Quests pages (FEATURE_QUESTS on, the main server). Since WO-115 (20 Oct) they carry
 * no player context: no Where you are, no open or locked, only facts about the quests.
 */
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("the home shows six categories and Jobs and errands, with no player context (WO-115)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Quests" }).click();
  await expect(page).toHaveURL(/\/quests$/);
  await expect(page.getByRole("heading", { level: 1, name: "Quests" })).toBeVisible();
  const cats = page.locator('a[href^="/quests/c/"]');
  await expect(cats).toHaveCount(6);
  for (const name of ["Main stories", "Guilds and factions", "Daedric Princes", "New lands", "Side stories", "Followers"]) await expect(cats.filter({ hasText: name })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Jobs and errands" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Missives/ })).toBeVisible();
  // How many lines; nothing about the player: no Where you are, no "open to you".
  await expect(cats.filter({ hasText: "Daedric Princes" })).toContainText(/\d+ quest lines/);
  await expect(page.getByRole("region", { name: "Where you are" })).toHaveCount(0);
  await expect(page.getByText(/open to you/)).toHaveCount(0);
});

test("Daedric Princes shows Ill Met By Moonlight at level 25, a fact, with no level to enter", async ({ page }) => {
  await page.goto("/quests/c/daedric-princes");
  await expect(page.getByRole("heading", { level: 1, name: "Daedric Princes" })).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Your level" })).toHaveCount(0);
  await expect(page.getByLabel("Only what I can start")).toHaveCount(0);
  const card = page.getByRole("article", { name: "Ill Met By Moonlight" });
  // Its level is a fact; with no player level, nothing says above or below it.
  await expect(card.getByText("Level 25", { exact: true })).toBeVisible();
  await expect(card.getByText("Hircine")).toBeVisible();
  await card.getByRole("button", { name: "Tell me more" }).click();
  await expect(card.getByRole("term").filter({ hasText: "Needs" })).toBeVisible();
  await expect(card.getByText("Level 25.", { exact: true })).toBeVisible();
});

test("Wyrmstooth: its needs as facts, no marks, and journals hidden until opened", async ({ page }) => {
  await page.goto("/quests/wyrmstooth");
  await expect(page.getByRole("heading", { level: 1, name: "Wyrmstooth" })).toBeVisible();
  const needs = page.getByRole("list", { name: "Needs" });
  const row = (t: string | RegExp) => needs.getByRole("listitem").filter({ hasText: t });
  await expect(row("Level 10")).toBeVisible();
  await expect(row("The main quest through The Way of the Voice")).toBeVisible();
  await expect(row("Rise in the East").getByRole("link", { name: "Rise in the East" })).toHaveAttribute("href", "/quests/rise-in-the-east");
  await expect(needs.getByLabel("Done")).toHaveCount(0);
  await expect(needs.getByLabel("Not yet")).toHaveCount(0);
  await expect(page.getByText("Not open to you yet.")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Do this first" })).toHaveCount(0);

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

test("The Book of Love: Ask Dinya Balu in the Temple of Mara, then Talk to Fastred at Fellstar Farm (WO-121)", async ({ page }) => {
  await page.goto("/quests/the-book-of-love");
  const start = page.getByRole("region", { name: "How to start it" });
  await expect(start).toContainText("Dinya Balu");
  await expect(start).not.toContainText("Fastred");
  const quest = page.locator("li", { hasText: "Starts here" });
  await quest.getByRole("button", { name: "Journal ›" }).click();
  await quest.getByText("How it starts").click();
  await expect(quest).toContainText('Ask Dinya Balu "Just tell me what to do." in Temple of Mara');
  await expect(quest).toContainText("Then: Talk to Fastred at Fellstar Farm");
});
