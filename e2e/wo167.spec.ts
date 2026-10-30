/**
 * WO-167: LoreRim's paper map on a place's page (a band cut around the place, its pin, the places around it, Getting there) and the whole
 * map on Places, with the credit its author asked for on every instance.
 */
import { expect, test } from "@playwright/test";

const CREDIT = "https://www.nexusmods.com/skyrimspecialedition/mods/62705";

async function creditOk(page: import("@playwright/test").Page, within = page.locator("main")) {
  const credit = within.getByRole("link", { name: /Map: Skyrim Paper Map by Caro Tuts/ });
  await expect(credit).toHaveAttribute("href", CREDIT);
  await expect(credit).toHaveAttribute("target", "_blank");
}

for (const width of [1440, 390]) {
  test(`Bleak Falls Barrow at ${width}: the map band under the title, its pin, the places around it, Getting there, and the credit`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places/bleak-falls-barrow");
    const map = page.getByRole("group", { name: "Map around this place" });
    await expect(map).toBeVisible();
    const box = (await map.boundingBox())!;
    // WO-184: the map shares the band with the lead screenshot, at 16:9 of half the width (about 405 at 1440); on a phone it sits under it.
    if (width === 1440) {
      expect(Math.abs(box.height - 405)).toBeLessThan(12);
      expect(box.width).toBeGreaterThanOrEqual(width / 2 - 2);
    } else {
      expect(box.height).toBeGreaterThanOrEqual(238);
      expect(box.width).toBeGreaterThanOrEqual(width - 2);
    }
    // Under the title and tags, above At a glance.
    const title = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    expect(box.y).toBeGreaterThan(title.y);
    // Tiles, not the whole map: a handful of pictures, each a 512 px tile.
    await expect.poll(async () => map.locator(`img[src^='/maps/tamriel/${width === 1440 ? 1 : 0}/']`).count()).toBeGreaterThan(width === 1440 ? 1 : 0);
    expect(await map.locator("img[src='/maps/tamriel.webp']").count()).toBe(0);
    await expect(map.getByText("Bleak Falls Barrow", { exact: true })).toBeVisible();
    // The places around it are pins that link, with names on the nearest few, every name on a dark plate.
    // On a phone the window is small, so there may be no neighbour in it; on a wide screen there are several.
    if (width === 1440) await expect(map.locator("a[href^='/places/']").first()).toHaveAttribute("href", /^\/places\//);
    const plates = map.locator("[class*='plate']");
    expect(await plates.count()).toBeGreaterThan(4);
    await creditOk(page, map);
    await expect(page.getByText("Getting there", { exact: true })).toBeVisible();
    await expect(page.getByText(/west of Riverwood/i).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-results/wo167-bleak-falls-barrow-${width}.png`, fullPage: false });
  });

  test(`Riverwood at ${width}: its own pin, and the credit`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places/riverwood");
    const map = page.getByRole("group", { name: "Map around this place" });
    await expect(map).toBeVisible();
    await expect(map.getByText("Riverwood", { exact: true }).first()).toBeVisible();
    await creditOk(page, map);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-results/wo167-riverwood-${width}.png`, fullPage: false });
  });

  test(`the Sleeping Giant Inn at ${width}: the town's pin, said as "In Riverwood" in the map and in Getting there`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places/sleeping-giant-inn");
    const map = page.getByRole("group", { name: "Map around this place" });
    await expect(map.getByText("In Riverwood", { exact: true })).toBeVisible();
    // WO-177: the row has its label like any other place's.
    await expect(page.getByText("Getting there", { exact: true })).toHaveCount(1);
    await expect(page.getByRole("region", { name: "Map" })).toContainText("In Riverwood.");
    await creditOk(page, map);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-results/wo167-sleeping-giant-inn-${width}.png`, fullPage: false });
  });

  test(`Places at ${width}: the whole map with every pin, narrowed by a kind, and the credit`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places");
    const map = page.getByRole("group", { name: "Map of Skyrim" });
    await expect(map).toBeVisible();
    await expect(map.locator("img[src='/maps/tamriel.webp']")).toHaveCount(1);
    const all = await map.locator("a[href^='/places/']").count();
    expect(all).toBeGreaterThan(300);
    await creditOk(page, map);
    await expect(map.getByRole("button", { name: "Zoom in" })).toBeVisible();
    await page.getByLabel("Kinds of place").getByRole("link", { name: /^Caves and mines/ }).click();
    await expect(page).toHaveURL(/type=caves/);
    const some = await page.getByRole("group", { name: "Map of Skyrim" }).locator("a[href^='/places/']").count();
    expect(some).toBeLessThan(all);
    expect(some).toBeGreaterThan(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-results/wo167-places-${width}.png`, fullPage: false });
  });
}

test("hovering a pin on Places previews the place", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places");
  const pin = page.getByRole("group", { name: "Map of Skyrim" }).getByRole("link", { name: "Bleak Falls Barrow" });
  await pin.hover();
  await expect(page.getByRole("tooltip")).toContainText("Bleak Falls Barrow");
});

test("a place on Solstheim has no map band and no empty box; a place with no position has none either", async ({ page }) => {
  for (const slug of ["baan-malur", "frozen-caverns"]) {
    await page.goto(`/places/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("group", { name: "Map around this place" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Map" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Skyrim Paper Map/ })).toHaveCount(0);
  }
});

test("the band pans when dragged, and the places around it stay in step", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/bleak-falls-barrow");
  const map = page.getByRole("group", { name: "Map around this place" });
  const here = map.getByText("Bleak Falls Barrow", { exact: true });
  const before = (await here.boundingBox())!;
  const b = (await map.boundingBox())!;
  await page.mouse.move(b.x + 700, b.y + 200);
  await page.mouse.down();
  await page.mouse.move(b.x + 500, b.y + 200, { steps: 6 });
  await page.mouse.up();
  const after = (await here.boundingBox())!;
  expect(before.x - after.x).toBeGreaterThan(150);
});
