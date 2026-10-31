/**
 * WO-184 Part 9 (Mac): the review of Parts 7 and 8. A map for anyone the planner can place, 44 px targets at 390, the scale bar clear of the credit, a town's facts beside the frame
 * so Who lives here starts on the first screen, the frame's own zoom, no form for a signed-out visitor, and the small things.
 */
import { expect, test } from "@playwright/test";

test("a person placed in a cell the map has gets a Map button (Arch-Paladin Laracin, Meridia's Sanctum)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/people/arch-paladin-laracin");
  const frame = page.locator("[data-view]");
  await expect(frame.getByRole("button", { name: "Map", exact: true })).toBeVisible();
  await frame.getByRole("button", { name: "Map", exact: true }).click();
  await expect(frame.getByRole("group", { name: "Map around this place" })).toBeVisible();
});

test("at 390 the frame's Full screen and the full screen map's Close are 44 px tall, the scale bar is clear of the credit, and the key stays", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/places/bleak-falls-barrow");
  const full = page.getByRole("button", { name: "Open the map full screen" });
  expect((await full.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  const scale = page.locator("[data-view] [class*='scale']").first();
  const credit = page.locator("[data-view]").getByRole("link", { name: /Map: Skyrim Paper Map/ });
  const a = (await scale.boundingBox())!;
  const b = (await credit.boundingBox())!;
  expect(a.y + a.height <= b.y + 1 || a.x + a.width <= b.x, "the scale bar runs under the credit").toBe(true);
  await full.click();
  const dialog = page.getByRole("dialog", { name: "Bleak Falls Barrow, full screen map" });
  expect((await dialog.getByRole("button", { name: "Close the full screen map" }).boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(dialog.getByText("Dangerous place", { exact: true }).first()).toBeVisible();
  await page.screenshot({ path: "test-results/wo184-9-map-full-390.png" });
});

test("a town's facts are beside the frame, and Who lives here starts on the first screen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/riverwood");
  const glance = page.getByRole("region", { name: "At a glance" });
  await expect(glance).toBeVisible();
  await expect(glance).toContainText("People");
  const box = (await glance.boundingBox())!;
  const frame = (await page.locator("[data-view]").boundingBox())!;
  expect(box.x, "the facts are left of the frame").toBeLessThan(frame.x);
  const who = (await page.getByRole("heading", { level: 2, name: "Who lives here" }).boundingBox())!;
  await page.screenshot({ path: "test-results/wo184-9-town-1440.png" });
  expect(who.y, "Who lives here is on the first screen (it was at 895)").toBeLessThan(860);
  // What is long is folded under its fact.
  await glance.getByText("Who keeps what").click();
  await expect(glance.getByRole("link", { name: /Alvor|Lucan/ }).first()).toBeVisible();
});

test("the frame's map has its own + and −, and the wheel still scrolls the page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/bleak-falls-barrow");
  const frame = page.locator("[data-view='map']");
  const ratio = async () => {
    const tiles = frame.locator("img[src^='/maps/tamriel/']");
    return (await tiles.first().getAttribute("src"))!.split("/")[3];
  };
  const before = await ratio();
  await frame.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.waitForTimeout(500);
  expect(await ratio()).not.toBe(before);
  await frame.getByRole("button", { name: "Zoom out", exact: true }).click();
  await page.waitForTimeout(500);
  expect(await ratio()).toBe(before);
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(50);
});

test("signed out, Help fill the gaps' I know this scrolls to the line and offers sign-in, with no form", async ({ page }) => {
  await page.goto("/people/mjoll-the-lioness#know-0");
  await expect(page.getByRole("button", { name: "Sign in to tell us" }).first()).toBeVisible();
  await expect(page.getByRole("group", { name: /What you know about/ })).toHaveCount(0);
});

test("small things: Sign in to add one once, a named boss only, the Danger fact links the enemies", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/bleak-falls-barrow");
  await page.locator("[data-view]").getByRole("button", { name: "Screenshot", exact: true }).click();
  await expect(page.locator("[data-view]").getByRole("button", { name: "Sign in to add one" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Sign in to add (yours|one)/ })).toHaveCount(1);
  const danger = page.getByRole("region", { name: "At a glance" }).getByRole("link", { name: /^Draugr and \d+ more kinds? ›$/ });
  await expect(danger).toHaveAttribute("href", "#danger");
  await expect(page.getByRole("region", { name: "Danger" })).toBeVisible();
  await page.goto("/places/fort-hraggstad");
  await expect(page.locator("main")).not.toContainText("Imperial Soldier");
  await expect(page.locator("main")).not.toContainText(/Its boss is Imperial/);
});

test("the search suggestions at 390 line up with the box", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/search");
  const box = page.getByRole("combobox").first();
  await box.fill("dawn");
  const list = page.getByRole("listbox", { name: "Suggestions" });
  await expect(list).toBeVisible();
  const field = (await box.locator("xpath=ancestor::form[1]").boundingBox())!;
  const l = (await list.boundingBox())!;
  expect(Math.abs(l.x - field.x)).toBeLessThan(3);
  expect(l.x + l.width).toBeLessThanOrEqual(field.x + field.width + 3);
});
