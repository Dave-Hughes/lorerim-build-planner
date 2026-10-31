/**
 * WO-172: places that share a name are still separate places. Eight Imperial camps, eight Sons of Skyrim camps and a few halls and
 * shrines have one name each; every one has its own address, pin, drawer and page, and the shared address lists them.
 */
import { expect, test, type Page } from "@playwright/test";

const map = (page: Page) => page.getByRole("group", { name: "Map of Skyrim" });

async function open(page: Page, url: string) {
  await page.goto(url);
  await expect(map(page)).toBeVisible();
  await page.waitForTimeout(700);
}

test("picking one Imperial camp lights one pin, and panning leaves nothing behind", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, "/map?place=imperial-military-camp-the-reach");
  const drawer = page.getByRole("complementary", { name: "Imperial Military Camp, the Reach" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Open the page" })).toHaveAttribute("href", "/places/imperial-military-camp-the-reach");
  await expect(drawer).toContainText(/Karthwasten/);
  await expect(drawer).toContainText("Danger:");
  // One pin is the picked one.
  await expect(map(page).locator("[class*='pickedBox']")).toHaveCount(1);
  // Pan about and zoom in and out: still one picked pin, every pin drawn once, none outside the map's frame.
  await page.screenshot({ path: "test-results/wo172-map-opening-1440.png" });
  const box = (await map(page).boundingBox())!;
  for (const [dx, dy] of [[-260, 90], [320, -140], [-120, 200]]) {
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6 + dx, box.y + box.height * 0.5 + dy, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(250);
    await expect(map(page).locator("[class*='pickedBox']")).toHaveCount(1);
    const hrefs = await map(page).locator("a[href^='/places/']").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(new Set(hrefs).size, "a pin is drawn once").toBe(hrefs.length);
  }
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.waitForTimeout(600);
  await expect(map(page).locator("[class*='pickedBox']")).toHaveCount(1);
  await page.screenshot({ path: "test-results/wo172-map-1440.png" });
});

test("another camp opens its own drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, "/map?place=imperial-military-camp-winterhold");
  const drawer = page.getByRole("complementary", { name: "Imperial Military Camp, Winterhold" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("Winterhold");
  await expect(map(page).locator("[class*='pickedBox']")).toHaveCount(1);
});

test("a camp says its levels after the war, not the one guard's", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/sons-of-skyrim-military-camp-the-reach");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sons of Skyrim Military Camp, the Reach");
  const danger = page.getByRole("region", { name: "Danger" });
  // WO-185 Part 4: every kind of enemy has its own row; the camp's garrison is Imperials at 22 to 27, not the one guard's.
  await expect(danger.getByText("Imperials").first()).toBeVisible();
  await expect(danger.getByText("Level 22 to 27").first()).toBeVisible();
  await expect(danger).not.toContainText(/Level 1 to 2\b/);
  await page.screenshot({ path: "test-results/wo172-camp-1440.png" });
});

test("the shared address lists the places with that name", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/imperial-military-camp");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Imperial Military Camp");
  await expect(page.getByText("8 places in Skyrim are called Imperial Military Camp")).toBeVisible();
  const links = page.getByRole("link", { name: /^Imperial Military Camp, / });
  await expect(links).toHaveCount(8);
  await page.screenshot({ path: "test-results/wo172-which-1440.png" });
  await links.filter({ hasText: "the Reach" }).click();
  await expect(page).toHaveURL(/\/places\/imperial-military-camp-the-reach$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Imperial Military Camp, the Reach");
});

test("a building in a town takes the town's name: the four Halls of the Dead", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/hall-of-the-dead");
  await expect(page.getByRole("link", { name: /^Hall of the Dead, / })).toHaveCount(4);
  await page.goto("/places/hall-of-the-dead-whiterun");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hall of the Dead, Whiterun");
  await expect(page.getByRole("link", { name: /Whiterun/ }).first()).toBeVisible();
});

test("search says which one", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/search?q=imperial%20military%20camp");
  await expect(page.getByRole("link", { name: "Imperial Military Camp, the Reach" }).first()).toBeVisible();
});

test("the places list says which one", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places?hold=The%20Reach");
  await expect(page.locator("section[aria-labelledby='list']").getByRole("link", { name: "Imperial Military Camp, the Reach" })).toHaveAttribute("href", "/places/imperial-military-camp-the-reach");
});
