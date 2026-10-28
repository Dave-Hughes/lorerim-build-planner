/**
 * WO-169: the Map page. LoreRim's paper map under the header with every place on it; search for places, people and quests; filters that fade
 * what is out; a quest's route; a place's drawer; where a signed-in player's character stands; the address keeps the view; the credit on every view.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";

const CREDIT = "https://www.nexusmods.com/skyrimspecialedition/mods/62705";

const credit = (page: Page) => page.getByRole("link", { name: /Map: Skyrim Paper Map by Caro Tuts/ });
const map = (page: Page) => page.getByRole("group", { name: "Map of Skyrim" });

async function open(page: Page, url = "/map") {
  await page.goto(url);
  await expect(map(page)).toBeVisible();
  // The pins and tiles settle after the window is measured.
  await page.waitForTimeout(500);
}

for (const width of [1440, 390]) {
  test(`the whole map at ${width}: tiles, clusters, the cities named, the credit, the controls`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await open(page);
    await expect(page.getByRole("banner").getByRole("link", { name: "LoreRim Planner" })).toBeVisible();
    await expect(credit(page)).toHaveAttribute("href", CREDIT);
    await expect(credit(page)).toHaveAttribute("target", "_blank");
    await expect(credit(page)).toBeVisible();
    expect(await map(page).locator("img[src^='/maps/tamriel/']").count()).toBeGreaterThan(1);
    // At a distance pins are counts; the cities are named.
    await expect(map(page).getByRole("button", { name: /places, zoom in/ }).first()).toBeVisible();
    await expect(map(page).getByText("Whiterun", { exact: true }).first()).toBeVisible();
    for (const n of ["Zoom in", "Zoom out", "North, and the whole map"]) await expect(page.getByRole("button", { name: n, exact: true })).toBeVisible();
    // On a phone the panel is a bar at the foot until it is opened.
    if (width === 390) await expect(page.getByRole("button", { name: "Search and filters" })).toBeVisible();
    else await expect(page.getByRole("complementary", { name: "Map controls" }).getByText(/^\d+ places$/)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    // The whole map fits beside the panel (and above a phone's bar): every city in view and named; counts only where pins pile up.
    const free = width === 1440 ? { left: 354, right: 1440, top: 69, bottom: 900 } : { left: 0, right: 390, top: 56, bottom: 844 - 56 };
    for (const city of ["Markarth", "Solitude", "Whiterun", "Windhelm", "Riften", "Falkreath", "Morthal", "Dawnstar", "Winterhold"]) {
      const b = await map(page).getByText(city, { exact: true }).first().boundingBox();
      expect(b, city).not.toBeNull();
      expect(b!.x, city).toBeGreaterThanOrEqual(free.left);
      expect(b!.x + b!.width, city).toBeLessThanOrEqual(free.right + 1);
      expect(b!.y, city).toBeGreaterThanOrEqual(free.top);
      expect(b!.y + b!.height, city).toBeLessThanOrEqual(free.bottom + 1);
    }
    expect(await map(page).getByRole("button", { name: /places, zoom in/ }).count()).toBeLessThan(width === 1440 ? 45 : 130);
    if (width === 1440) expect(await map(page).locator("a[href^='/places/']").count()).toBeGreaterThan(300);
    await page.screenshot({ path: `test-results/wo169-whole-${width}.png` });
  });

  test(`a place's drawer at ${width}: search, pick, the drawer, the address, Esc`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await open(page);
    if (width === 390) await page.getByRole("button", { name: "Search and filters" }).click();
    await page.keyboard.press("/");
    const box = page.getByRole("combobox", { name: "Search the map" });
    await expect(box).toBeFocused();
    await box.fill("Bleak Falls");
    const results = page.getByRole("listbox", { name: "Results" });
    await expect(results.getByRole("option", { name: /Bleak Falls Barrow/ }).first()).toContainText("Place");
    await expect(results.getByRole("option", { name: /Bleak Falls Barrow/ }).first()).toContainText(/Level \d+/);
    await page.screenshot({ path: `test-results/wo169-search-${width}.png` });
    await results.getByRole("option", { name: /Bleak Falls Barrow/ }).first().click();
    const drawer = page.getByRole("complementary", { name: "Bleak Falls Barrow" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Open the page" })).toHaveAttribute("href", "/places/bleak-falls-barrow");
    await expect(drawer).toContainText("West of Riverwood");
    await expect(drawer).toContainText(/The boss/);
    await expect(page).toHaveURL(/place=bleak-falls-barrow/);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `test-results/wo169-drawer-${width}.png` });
    await drawer.getByRole("button", { name: "Close" }).click();
    await expect(drawer).toHaveCount(0);
    await expect(page).not.toHaveURL(/place=/);
  });
}

test("a quest lights its places in order, numbered, with a dashed route between them", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await page.keyboard.press("/");
  await page.getByRole("combobox", { name: "Search the map" }).fill("Forbidden Legend");
  await page.getByRole("listbox", { name: "Results" }).getByRole("option", { name: /Forbidden Legend/ }).first().click();
  await expect(page.getByRole("complementary", { name: "Map controls" }).getByText(/The route of/)).toBeVisible();
  await expect(page).toHaveURL(/quest=forbidden-legend/);
  await page.waitForTimeout(900);
  await expect(map(page).getByText("4", { exact: true }).first()).toBeVisible();
  await expect(map(page).locator("svg polyline[stroke-dasharray]")).toHaveCount(1);
  await page.screenshot({ path: "test-results/wo169-route-1440.png" });
  // The address keeps it: a fresh load shows the route.
  await page.reload();
  await expect(page.getByRole("complementary", { name: "Map controls" }).getByText(/The route of/)).toBeVisible();
});

test("a person flies to where they are and opens their place", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await page.keyboard.press("/");
  await page.getByRole("combobox", { name: "Search the map" }).fill("Lydia");
  await page.getByRole("listbox", { name: "Results" }).getByRole("option", { name: /^Lydia/ }).first().click();
  await expect(page.getByRole("complementary").filter({ has: page.getByRole("link", { name: "Open the page" }) })).toBeVisible();
  await expect(page).toHaveURL(/place=/);
});

test("the filters fade what is out: a kind, a danger range, only places with a quest", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  const panel = page.getByRole("complementary", { name: "Map controls" });
  const total = Number((await panel.getByText(/^\d+ places$/).innerText()).split(" ")[0]);
  await panel.getByRole("button", { name: /^Caves and mines/ }).click();
  await expect(panel.getByText(/^\d+ of \d+ places$/)).toBeVisible();
  const caves = Number((await panel.getByText(/of \d+ places$/).innerText()).split(" ")[0]);
  expect(caves).toBeLessThan(total);
  await panel.getByRole("button", { name: "All", exact: true }).click();
  await panel.getByRole("slider", { name: "Lowest level" }).fill("20");
  await expect(panel.getByText("level 20 to 50 and up")).toBeVisible();
  await expect(page).toHaveURL(/danger=20-50/);
  await panel.getByRole("slider", { name: "Lowest level" }).fill("1");
  await panel.getByLabel("Only places with a quest").check();
  await expect(panel.getByText(/^\d+ of \d+ places$/)).toBeVisible();
  await expect(page).toHaveURL(/quests=1/);
});

test("the address keeps the view: a place, the filters and the zoom come back from a link", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map?place=bleak-falls-barrow&types=ruins&z=0.9");
  await expect(page.getByRole("complementary", { name: "Bleak Falls Barrow" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Ruins/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/z=0\.9/);
  // Close in, every place is named.
  await expect(map(page).getByText("Bleak Falls Barrow", { exact: true }).first()).toBeVisible();
});

test("a place page's map band links to the map opened on that place", async ({ page }) => {
  await page.goto("/places/bleak-falls-barrow");
  await expect(page.getByRole("link", { name: "Open on the map ›" })).toHaveAttribute("href", "/map?place=bleak-falls-barrow");
});

test("signed out there is no character toggle; signed in, the character's pin sits where its latest save puts it", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await expect(page.getByLabel("Where my character is")).toHaveCount(0);
  await signIn(context);
  await open(page);
  const pick = page.getByLabel("Where my character is");
  await expect(pick).toBeVisible();
  await pick.selectOption({ label: "Kyria Severa" });
  await expect(page.getByTestId("my-character")).toContainText("Kyria Severa");
  await expect(page).toHaveURL(/character=/);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "test-results/wo169-character-1440.png" });
});

test("on a phone a picked place has its pin in the part of the map above the sheet, its name on its plate", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map?place=riverwood");
  await expect(page.getByRole("complementary", { name: "Riverwood" })).toBeVisible();
  await page.waitForTimeout(600);
  const plate = map(page).locator("a[href='/places/riverwood']");
  const b = (await plate.boundingBox())!;
  const sheet = (await page.getByRole("complementary", { name: "Riverwood" }).boundingBox())!;
  expect(b.y + b.height).toBeLessThan(sheet.y);
  expect(b.y).toBeGreaterThan(56);
  await expect(plate).toContainText("Riverwood");
  await page.screenshot({ path: "test-results/wo169-riverwood-390.png" });
});
