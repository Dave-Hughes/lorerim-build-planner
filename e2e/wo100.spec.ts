/**
 * WO-100: the Quests pages (FEATURE_QUESTS on, the main server). Since WO-115 (20 Oct) they carry
 * no player context: no Where you are, no open or locked, only facts about the quests.
 */
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("the home shows the categories and everything else by place, with no player context (WO-115)", async ({ page }) => {
  await page.goto("/characters");
  await page.getByRole("banner").getByRole("button", { name: "World" }).click();
  await page.getByRole("banner").getByRole("link", { name: /^Quests/ }).click();
  await expect(page).toHaveURL(/\/quests$/);
  await expect(page.getByRole("heading", { level: 1, name: "Quests" })).toBeVisible();
  const cats = page.locator('a[href^="/quests/c/"]');
  await expect(cats).toHaveCount(6);
  for (const name of ["Main stories", "Guilds and factions", "Daedric Princes", "New lands", "Side stories", "Followers"]) await expect(cats.filter({ hasText: name })).toHaveCount(1);
  // The jobs and the side stories sit under "Every quest, by place" (WO-154 Part 2).
  await expect(page.getByRole("heading", { name: "Every quest, by place" })).toBeVisible();
  await expect(page.locator('a[href="/quests/missives"]')).toBeVisible();
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
  const card = page.getByRole("row").filter({ has: page.getByRole("link", { name: "Ill Met By Moonlight" }) });
  // Its level is a fact; with no player level, nothing says above or below it (WO-163: a row of the category's table).
  await expect(card.getByText("25", { exact: true })).toBeVisible();
  await expect(card.getByRole("button", { name: "Tell me more" })).toHaveCount(0);
  // A line of one quest opens the quest's own page.
  await card.getByRole("link", { name: "Ill Met By Moonlight" }).first().click();
  await expect(page).toHaveURL(/\/quests\/q\/ill-met-by-moonlight$/);
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
  const quests = page.getByRole("region", { name: "The story" });
  // The opening quest is the first (WO-160 Part 5 dropped the Starts here chip).
  await expect(quests.getByRole("listitem").first().getByRole("link").first()).toHaveAttribute("href", /\/quests\/q\//);
  await expect(page.getByRole("button", { name: "Journal ›" })).toHaveCount(0);
  await expect(page.getByText("game files", { exact: true })).toHaveCount(0);
});

test("The Book of Love: Ask Dinya Balu in the Temple of Mara, then Talk to Fastred at Fellstar Farm (WO-121)", async ({ page }) => {
  await page.goto("/quests/the-book-of-love");
  const start = page.getByRole("region", { name: "At a glance" });
  await expect(start).toContainText("Dinya Balu");
  // The line's read words how to get in as the read does, with where she sends you first (WO-154 Part 2).
  await expect(start).toContainText("Fastred");
  // Its quest's page has the way in and the first step (WO-154).
  await page.getByRole("region", { name: "The story" }).getByRole("listitem").first().getByRole("link").first().click();
  await expect(page.getByRole("region", { name: "How to start it" })).toContainText(/Dinya Balu\s+in Temple of Mara, Riften/);
  await expect(page.locator("main")).toContainText("Talk to Fastred");
});
