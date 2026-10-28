/**
 * WO-168: the three main stories as banners: the scene in layers, the story's colour, the row growing and the layers parting under the pointer
 * or keyboard focus, each story doing its own thing; reduced motion; a phone.
 */
import { expect, test } from "@playwright/test";

const ROWS = [
  { id: "main-quest", name: "Become the Dragonborn", colour: "rgb(240, 145, 63)", layers: ["sky", "far", "dragon", "near"] },
  { id: "dragonborn", name: "Dragonborn", colour: "rgb(143, 192, 124)", layers: ["sky", "far", "near", "tentacles"] },
  { id: "dawnguard", name: "Join the Dawnguard", colour: "rgb(214, 69, 63)", layers: ["sky", "far", "bats", "near"] },
] as const;

const row = (page: import("@playwright/test").Page, name: string) => page.getByRole("link", { name: new RegExp(`^${name}\\b`) }).filter({ has: page.getByRole("heading", { name }) });

test("each row is its own world: the scene's layers, its colour on the edge, the number, the name, tags, a line, XP and Open the story", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/main-stories");
  for (const [i, r] of ROWS.entries()) {
    const link = row(page, r.name);
    await expect(link).toHaveAttribute("href", `/quests/${r.id}`);
    expect(await link.locator("img").evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute("src")))).toEqual(r.layers.map((l) => `/quests/stories/${r.id}/${l}.png`));
    // Every layer's image loads (a layer that points at a missing file is a broken image with a natural width of 0).
    await expect.poll(() => link.locator("img").evaluateAll((els) => els.map((e) => (e as HTMLImageElement).naturalWidth))).toEqual(r.layers.map(() => 320));
    expect(await link.evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(r.colour);
    expect(Math.round((await link.boundingBox())!.height)).toBe(280);
    await expect(link).toContainText(String(i + 1));
    await expect(link).toContainText("Quest XP");
    await expect(link.getByText("Open the story ›")).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "Tied to these stories" })).toBeVisible();
});

test("under the pointer the row grows to 360 and its chapters slide in; keyboard focus does the same; the layers part", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/main-stories");
  for (const r of ROWS) {
    const link = row(page, r.name);
    await link.scrollIntoViewIfNeeded();
    await link.hover();
    await expect.poll(async () => Math.round((await link.boundingBox())!.height), { timeout: 3000 }).toBe(360);
    const near = link.locator("img").nth(r.layers.indexOf("near"));
    await expect.poll(() => near.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41), { timeout: 3000 }).toBeLessThan(-20);
    await expect(link.locator('[class*="__ch"]')).toBeVisible();
    await page.screenshot({ path: `test-results/wo168-${r.id}-hover-1440.png`, clip: { x: 0, y: Math.max(0, ((await link.boundingBox())!.y) - 20), width: 1440, height: 420 } });
    await page.mouse.move(5, 5);
    await expect.poll(async () => Math.round((await link.boundingBox())!.height), { timeout: 3000 }).toBe(280);
  }
  // Keyboard focus: the same.
  const first = row(page, ROWS[0].name);
  await first.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect.poll(async () => Math.round((await first.boundingBox())!.height), { timeout: 3000 }).toBe(360);
});

test("each story does its own thing under the pointer: Alduin flies, the tentacles sway faster, the corona pulses and the bats scatter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/main-stories");
  const anim = (loc: import("@playwright/test").Locator) => loc.evaluate((el) => getComputedStyle(el).animationName);
  const mq = row(page, "Become the Dragonborn");
  expect(await anim(mq.locator("img").nth(2))).toContain("bob");
  await mq.hover();
  await expect.poll(() => anim(mq.locator("img").nth(2))).toContain("fly");
  const dbn = row(page, "Dragonborn");
  await dbn.hover();
  await expect.poll(() => dbn.locator("img").nth(3).evaluate((el) => getComputedStyle(el).animationDuration)).toBe("1.6s");
  const dg = row(page, "Join the Dawnguard");
  await dg.hover();
  await expect.poll(() => anim(dg.locator("img").nth(2))).toContain("scatter");
  await expect.poll(() => anim(dg.locator('[class*="__corona"]'))).toContain("pulse");
});

test("reduced motion: no flight, sway, scatter or falling ash; the row still opens and the colour still shows", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/main-stories");
  for (const r of ROWS) {
    const link = row(page, r.name);
    await link.hover();
    await expect.poll(async () => Math.round((await link.boundingBox())!.height), { timeout: 3000 }).toBe(360);
    expect(await link.evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(r.colour);
    for (const name of await link.locator("img, [class*=ash], [class*=corona], [class*=emb] i").evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName))) expect(name).toBe("none");
  }
});

test("a phone: each row is 220 px with the scene behind a stronger fade, nothing grows or moves, and tapping opens the story", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quests/c/main-stories");
  for (const r of ROWS) {
    const link = row(page, r.name);
    expect(Math.round((await link.boundingBox())!.height)).toBe(220);
    for (const name of await link.locator("img").evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName))) expect(name).toBe("none");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/wo168-main-stories-390.png", fullPage: true });
  await row(page, "Join the Dawnguard").click();
  await expect(page).toHaveURL(/\/quests\/dawnguard$/);
});
