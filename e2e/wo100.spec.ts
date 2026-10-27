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

  // Each quest is a row that links to its own page (WO-154): no journal to open, and what it needs beyond the quest before it.
  const quests = page.getByRole("region", { name: "The quests in order" });
  const opening = quests.getByRole("listitem").filter({ hasText: "Starts here" });
  await expect(opening).toHaveCount(1);
  await expect(opening.getByRole("link").first()).toHaveAttribute("href", /\/quests\/q\//);
  await expect(page.getByRole("button", { name: "Journal ›" })).toHaveCount(0);
  await expect(page.getByText("game files", { exact: true })).toHaveCount(0);
});

test("The Book of Love: Ask Dinya Balu in the Temple of Mara, then Talk to Fastred at Fellstar Farm (WO-121)", async ({ page }) => {
  await page.goto("/quests/the-book-of-love");
  const start = page.getByRole("region", { name: "How to start it" });
  await expect(start).toContainText("Dinya Balu");
  await expect(start).not.toContainText("Fastred");
  // Its quest's page has the way in and the first step (WO-154).
  await page.locator("li", { hasText: "Starts here" }).getByRole("link").first().click();
  await expect(page.getByRole("region", { name: "How to start it" })).toContainText(/Dinya Balu\s+in Temple of Mara, Riften/);
  await expect(page.locator("main")).toContainText("Talk to Fastred");
});
