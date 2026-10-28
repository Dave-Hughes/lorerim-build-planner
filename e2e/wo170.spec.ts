/**
 * WO-170: the home page comes alive: the hero moves (Alduin, a shooting star, embers, drift), three stories to live through, and the map strip.
 */
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

const anon = { storageState: { cookies: [], origins: [{ origin: "http://localhost:3123", localStorage: [{ name: "planner.tour.offer", value: "done" }, { name: "planner.tour.reader", value: "done" }] }] } };

test.describe("signed out", () => {
  test.use(anon);

  test("the order of the page: hero, recent characters, three stories, the map strip, new in the world, three ways", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const heads = (await page.locator("main h2").allInnerTexts()).map((t) => t.toLowerCase());
    const at = (t: string) => heads.findIndex((h) => h.includes(t));
    const order = [at("recent characters"), at("three stories to live through"), at("every place"), at("new in the world"), at("three ways to use it")];
    expect(order.every((n) => n >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  test("the hero moves: Alduin, a shooting star, embers; the layers drift with the pointer, the far ones least; the words stay put", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const hero = page.locator("section[aria-label='LoreRim Planner']");
    const name = (sel: string) => hero.locator(sel).first().evaluate((el) => getComputedStyle(el).animationName);
    expect(await name("[class*='alduin']")).toContain("alduin");
    expect(await name("[class*='shootA']")).toContain("shoot");
    expect(await name("[class*='embers'] i")).toContain("ember");
    expect(await hero.locator("[class*='embers'] i").count()).toBeGreaterThan(5);
    const layer = (i: number) => hero.locator("img[class*='layer']").nth(i);
    const title = hero.getByRole("heading", { level: 1 });
    const t0 = await title.boundingBox();
    await page.mouse.move(80, 300);
    await page.waitForTimeout(250);
    const far0 = (await layer(0).evaluate((el) => getComputedStyle(el).translate)).split(" ")[0];
    const near0 = (await hero.locator("[class*='fire']").first().evaluate((el) => getComputedStyle(el).translate)).split(" ")[0];
    await page.mouse.move(1360, 300);
    await page.waitForTimeout(250);
    const far1 = (await layer(0).evaluate((el) => getComputedStyle(el).translate)).split(" ")[0];
    const near1 = (await hero.locator("[class*='fire']").first().evaluate((el) => getComputedStyle(el).translate)).split(" ")[0];
    const moved = (a: string, b: string) => Math.abs(parseFloat(a) - parseFloat(b));
    expect(moved(near0, near1)).toBeGreaterThan(moved(far0, far1) * 3);
    expect(moved(near0, near1)).toBeGreaterThan(10);
    // The words are not a layer.
    const t1 = await title.boundingBox();
    expect(t1!.x).toBeCloseTo(t0!.x, 0);
    await page.screenshot({ path: "test-results/wo170-hero-1440.png" });
  });

  test("three stories to live through at 1440: three 300 px cards in a row, their figures from the data, a card lifts 8 px under the pointer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const sec = page.getByRole("region", { name: "Three stories to live through" });
    await expect(sec.getByRole("link", { name: "Every quest line ›" })).toHaveAttribute("href", "/quests/c/main-stories");
    const cards = sec.locator("a[class*='card']");
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toContainText("Become the Dragonborn");
    await expect(cards.nth(1)).toContainText("Dragonborn");
    await expect(cards.nth(2)).toContainText("Join the Dawnguard");
    await expect(cards.nth(0)).toHaveAttribute("href", "/quests/main-quest");
    for (const i of [0, 1, 2]) await expect(cards.nth(i)).toContainText(/\d+ quests?/);
    await expect(cards.nth(0)).toContainText("3,800");
    await expect(cards.nth(1)).toContainText("Level 25");
    await expect(cards.nth(2)).toContainText(/Level \d+/);
    const boxes = await Promise.all([0, 1, 2].map((i) => cards.nth(i).boundingBox()));
    for (const b of boxes) expect(Math.abs(b!.height - 300)).toBeLessThan(2);
    expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x + boxes[0]!.width - 2);
    expect(Math.abs(boxes[0]!.y - boxes[2]!.y)).toBeLessThan(2);
    await cards.nth(0).hover();
    await page.waitForTimeout(700);
    const lifted = (await cards.nth(0).boundingBox())!;
    expect(boxes[0]!.y - lifted.y).toBeGreaterThanOrEqual(7);
    expect(await cards.nth(0).locator("img[class*='dragon']").evaluate((el) => getComputedStyle(el).animationName)).toContain("fly");
    await page.screenshot({ path: "test-results/wo170-stories-hover-1440.png" });
    await cards.nth(1).hover();
    await page.waitForTimeout(500);
    expect(await cards.nth(1).locator("img[class*='tentacles']").evaluate((el) => getComputedStyle(el).animationDuration)).toBe("1.6s");
    await cards.nth(2).hover();
    await page.waitForTimeout(500);
    expect(await cards.nth(2).locator("img[class*='bats']").evaluate((el) => getComputedStyle(el).animationName)).toContain("scatter");
  });

  test("the map strip at 1440: 420 px, the words, counts from the data, Open the map, and the credit", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const strip = page.getByRole("region", { name: "Every place, on the game's own map" });
    await strip.scrollIntoViewIfNeeded();
    const b = (await strip.boundingBox())!;
    expect(Math.abs(b.height - 420)).toBeLessThan(2);
    expect(b.width).toBeGreaterThanOrEqual(1438);
    await expect(strip).toContainText(/\d+ places are pinned on it, from \d+ towns and cities to \d+ that are worth a fight/);
    await expect(strip.getByRole("link", { name: "Open the map" })).toHaveAttribute("href", "/map");
    const credit = strip.getByRole("link", { name: /Map: Skyrim Paper Map by Caro Tuts/ });
    await expect(credit).toHaveAttribute("href", "https://www.nexusmods.com/skyrimspecialedition/mods/62705");
    await expect(credit).toHaveAttribute("target", "_blank");
    expect(await strip.locator("[class*='pin']").count()).toBeGreaterThan(2);
    expect(await strip.locator("[class*='picture']").evaluate((el) => getComputedStyle(el.parentElement!).animationName)).toContain("drift");
    await page.waitForTimeout(500);
    await page.screenshot({ path: "test-results/wo170-map-strip-1440.png" });
  });

  test("reduced motion: nothing flies, drifts or pulses; the cards still lift and show their colour", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const hero = page.locator("section[aria-label='LoreRim Planner']");
    expect(await hero.locator("[class*='alduin']").evaluate((el) => getComputedStyle(el).display)).toBe("none");
    expect(await hero.locator("[class*='shootA']").evaluate((el) => getComputedStyle(el).display)).toBe("none");
    await page.mouse.move(1300, 300);
    await page.waitForTimeout(250);
    expect(await hero.locator("[class*='fire']").first().evaluate((el) => getComputedStyle(el).translate)).toBe("none");
    const strip = page.getByRole("region", { name: "Every place, on the game's own map" });
    expect(await strip.locator("[class*='picture']").evaluate((el) => getComputedStyle(el.parentElement!).animationName)).toBe("none");
    const card = page.getByRole("region", { name: "Three stories to live through" }).locator("a[class*='card']").first();
    await card.scrollIntoViewIfNeeded();
    const y0 = (await card.boundingBox())!.y;
    await card.hover();
    await page.waitForTimeout(300);
    expect(y0 - (await card.boundingBox())!.y).toBeGreaterThanOrEqual(7);
    expect(await card.locator("img[class*='dragon']").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  });

  test("a phone: the cards stack at 220 px, the layers still; the map strip is 300 px with the credit; nothing overflows", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const cards = page.getByRole("region", { name: "Three stories to live through" }).locator("a[class*='card']");
    await expect(cards).toHaveCount(3);
    const boxes = await Promise.all([0, 1, 2].map((i) => cards.nth(i).boundingBox()));
    for (const b of boxes) expect(Math.abs(b!.height - 220)).toBeLessThan(2);
    expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y + 200);
    const strip = page.getByRole("region", { name: "Every place, on the game's own map" });
    await strip.scrollIntoViewIfNeeded();
    expect(Math.abs((await strip.boundingBox())!.height - 300)).toBeLessThan(2);
    await expect(strip.getByRole("link", { name: /Map: Skyrim Paper Map/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: "test-results/wo170-map-strip-390.png" });
    await cards.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: "test-results/wo170-stories-390.png" });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: "test-results/wo170-home-390.png" });
  });
});

test("signed in at 1440: the shorter hero keeps the motion, and Your characters comes last", async ({ page, context }) => {
  await signIn(context);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator("section[aria-label='LoreRim Planner']");
  expect(await hero.locator("[class*='alduin']").evaluate((el) => getComputedStyle(el).animationName)).toContain("alduin");
  const heads = (await page.locator("main h2").allInnerTexts()).map((t) => t.toLowerCase());
  expect(heads.findIndex((h) => h.includes("three stories"))).toBeGreaterThan(heads.findIndex((h) => h.includes("recent characters")));
  expect(heads.findIndex((h) => h.includes("new in the world"))).toBeLessThan(heads.length - 1);
  expect(heads.at(-1)).toContain("your characters");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/wo170-signed-in-1440.png", fullPage: true });
});
