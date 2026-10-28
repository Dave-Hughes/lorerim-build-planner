/**
 * WO-174: Dave's test of 28 Oct. A quest's side column is the contents only and never runs over a box while you scroll; the first step is not said
 * twice and a sentence with links runs on; a quest's address is its name, never its editor id, and the old address redirects. The Map page is simpler:
 * no Danger sliders, filtered-out places are not drawn (wo169.spec.ts), a corner chevron folds the panel; hover previews stay on screen.
 */
import { expect, test, type Page } from "@playwright/test";

const map = (page: Page) => page.getByRole("group", { name: "Map of Skyrim" });

test("a quest's page: the side column is the contents only, and scrolling never lays it over another box", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/q/song-of-the-green");
  await expect(page.getByRole("heading", { level: 1, name: "Song of the Green" })).toBeVisible();
  const side = page.locator("main aside");
  await expect(side.getByRole("heading")).toHaveCount(0);
  await expect(side.locator("section")).toHaveCount(0);
  // Rewards and People are in the main column: Rewards first, People after Where it takes you.
  const heads = await page.locator("main section h2").allInnerTexts();
  const at = (re: RegExp) => heads.findIndex((h) => re.test(h));
  if (at(/^Rewards$/i) >= 0) expect(at(/^Rewards$/i)).toBeLessThan(at(/How to start it/i));
  if (at(/^People$/i) >= 0 && at(/Where it takes you/i) >= 0) expect(at(/^People$/i)).toBeGreaterThan(at(/Where it takes you/i));
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(total).toBeGreaterThan(900 * 2);
  const nav = page.getByRole("navigation", { name: "On this page" });
  await expect(nav).toBeVisible();
  for (let y = 0; y < total; y += 300) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    const n = await nav.boundingBox();
    if (!n) continue;
    const boxes = await page.locator("main section").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).filter((r) => r.height > 0).map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })));
    for (const b of boxes) {
      const over = n.x < b.x + b.w && n.x + n.width > b.x && n.y < b.y + b.h && n.y + n.height > b.y;
      expect(over, `the contents over a box at scroll ${y}`).toBe(false);
    }
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.45));
  await page.screenshot({ path: "test-results/wo174-song-of-the-green-1440.png" });
});

test("How to start it has no First step, and a sentence with links runs on as text", async ({ page }) => {
  for (const slug of ["song-of-the-green", "dungeon-delving-bandits"]) {
    await page.goto(`/quests/q/${slug}`);
    const start = page.locator("section").filter({ has: page.getByRole("heading", { name: "How to start it" }) });
    await expect(start).toBeVisible();
    await expect(start.getByText("First step")).toHaveCount(0);
    // No paragraph here is more than a few lines: one word to a line would be tall.
    for (const p of await start.locator("p").all()) {
      const b = (await p.boundingBox())!;
      expect(b.height, await p.innerText()).toBeLessThan(110);
    }
  }
});

test("a quest's address is its name; the old address from its editor id redirects", async ({ page }) => {
  await page.goto("/quests/q/favor204");
  await expect(page).toHaveURL(/\/quests\/q\/dungeon-delving-bandits$/);
  await expect(page.getByRole("heading", { level: 1, name: "Dungeon Delving (Bandits)" })).toBeVisible();
  await page.goto("/quests/q/favor204whiterun");
  await expect(page).toHaveURL(/\/quests\/q\/dungeon-delving-bandits-whiterun$/);
});

test("the Map panel folds with a chevron in its corner, named for screen readers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map");
  await expect(map(page)).toBeVisible();
  const panel = page.getByRole("complementary", { name: "Map controls" });
  await expect(panel.getByText("Fold", { exact: true })).toHaveCount(0);
  const chevron = panel.getByRole("button", { name: "Fold the panel" });
  await expect(chevron).toBeVisible();
  const p = (await panel.boundingBox())!;
  const c = (await chevron.boundingBox())!;
  expect(c.x + c.width).toBeGreaterThan(p.x + p.width - 24);
  expect(c.y).toBeLessThan(p.y + 24);
  await chevron.click();
  await expect(panel.getByRole("button", { name: "Open search and filters" })).toHaveAttribute("aria-expanded", "false");
  await panel.getByRole("button", { name: "Open search and filters" }).click();
  await expect(panel.getByRole("button", { name: "Fold the panel" })).toBeVisible();
});

test("a hover preview stays on screen near the right edge and the bottom of the Map page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map?z=0.5");
  await expect(map(page)).toBeVisible();
  await page.waitForTimeout(600);
  const pins = map(page).locator("a[href^='/places/']");
  // The pins nothing else is on top of, with where their right and lower edges are.
  const all = await pins.evaluateAll((els) =>
    els
      .map((e, i) => {
        const r = e.getBoundingClientRect();
        const at = document.elementFromPoint(r.x + 7, r.y + r.height / 2);
        return { i, x: r.x + r.width, y: r.y + r.height, free: !!at && (e === at || e.contains(at)) && r.x > 0 && r.y > 60 && r.x < innerWidth && r.bottom < innerHeight };
      })
      .filter((p) => p.free),
  );
  expect(all.length).toBeGreaterThan(3);
  const right = [...all].sort((a, b) => b.x - a.x)[0];
  const low = [...all].sort((a, b) => b.y - a.y)[0];
  for (const pick of [right, low]) {
    await page.mouse.move(5, 5);
    await pins.nth(pick.i).hover({ position: { x: 7, y: 6 } });
    const card = page.getByRole("tooltip");
    await expect(card).toBeVisible();
    const r = (await card.boundingBox())!;
    expect(r.x, "left edge").toBeGreaterThanOrEqual(0);
    expect(r.x + r.width, "right edge").toBeLessThanOrEqual(1440);
    expect(r.y + r.height, "bottom edge").toBeLessThanOrEqual(900);
  }
  await page.screenshot({ path: "test-results/wo174-map-hover-1440.png" });
});

test("the home page's map strip says what the Map page does now", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Search them, filter them by kind, and follow a quest from one place to the next\./)).toBeVisible();
  await expect(page.getByText(/filter them by danger/)).toHaveCount(0);
});

test("WO-176: Rewards is not said twice: Song of the Green has it in At a glance only, a quest with more to say keeps the section", async ({ page }) => {
  await page.goto("/quests/q/song-of-the-green");
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Rewards");
  await expect(page.getByRole("heading", { level: 2, name: "Rewards", exact: true })).toHaveCount(0);
  await page.goto("/quests/q/lights-out");
  await expect(page.getByRole("heading", { level: 2, name: "Rewards", exact: true })).toBeVisible();
});
