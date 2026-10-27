/**
 * WO-92: the Gear page and an item's page (FEATURE_GEAR on, the main server).
 */
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

const firstName = (page: import("@playwright/test").Page) => page.locator("table tbody tr").first().getByRole("link").first();

test("Body, Light and Armor rating list Daedric Mail Cuirass first; the URL holds them and Back restores them", async ({ page }) => {
  await page.goto("/characters");
  await page.getByRole("banner").getByRole("button", { name: "World" }).click();
  await page.getByRole("banner").getByRole("link", { name: /^Gear/ }).click();
  await expect(page).toHaveURL(/\/gear$/);
  await expect(page.getByRole("banner").getByRole("button", { name: "World" })).toHaveAttribute("aria-current", "page");

  await page.getByRole("group", { name: "Type" }).getByRole("button", { name: /^Body/ }).click();
  await expect(page).toHaveURL(/type=Body/);
  await page.getByRole("combobox", { name: "Armor", exact: true }).selectOption("Light");
  await expect(page).toHaveURL(/armor=Light/);
  await page.getByRole("combobox", { name: "Sort", exact: true }).selectOption("armor");
  await expect(page).toHaveURL(/\/gear\?type=Body&armor=Light&sort=armor$/);
  await expect(firstName(page)).toHaveText("Daedric Mail Cuirass");
  await expect(page.getByRole("group", { name: "Type" }).getByRole("button", { name: /^Body/ })).toHaveAttribute("aria-pressed", "true");

  // Back steps through the filters one at a time.
  await page.goBack();
  await expect(page).toHaveURL(/\/gear\?type=Body&armor=Light$/);
  await page.goForward();
  await expect(page).toHaveURL(/sort=armor$/);

  // The name opens the item's page; Back returns to the same list.
  await firstName(page).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Daedric Mail Cuirass");
  await expect(page.getByRole("link", { name: "‹ Light armor for the body" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/gear\?type=Body&armor=Light&sort=armor$/);
  await expect(firstName(page)).toHaveText("Daedric Mail Cuirass");
  await expect(page.getByRole("combobox", { name: "Armor", exact: true })).toHaveValue("Light");
});

test("Glass Cuirass's page: its stat line, Make it at the Forge with Glass Smithing, Improve it, Where to find it and Records", async ({ page }) => {
  await page.goto("/gear/skyrim-esm-013939");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Glass Cuirass");
  await expect(page.getByText("Body|Light armor|275 armor|12.5 weight")).toBeVisible();
  const make = page.getByRole("region", { name: "Make it" });
  await expect(make.getByText("Forge", { exact: true })).toBeVisible();
  await expect(make.getByRole("button", { name: "Glass Smithing" })).toBeVisible();
  await expect(make.getByText("Refined Moonstone")).toBeVisible();
  await expect(make.getByText("Improve it")).toBeVisible();
  await expect(make.getByText("Workbench")).toBeVisible();
  await expect(page.getByRole("region", { name: "Where to find it" })).toContainText("Not listed yet.");
  const records = page.getByRole("region", { name: "Records" });
  await expect(records.getByText("013939")).toBeVisible();
  // Skyrim.esm has no Nexus page: plain text.
  await expect(records.getByText("Skyrim.esm", { exact: true })).toBeVisible();
  await expect(records.getByRole("link")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "‹ Gear" })).toHaveAttribute("href", "/gear");
});

test("a plugin link opens in a new tab on nexusmods.com; Skyrim.esm is plain text", async ({ page }) => {
  await page.goto("/gear?type=Body&armor=Light&sort=armor");
  const link = page.locator('table a[href*="nexusmods.com"]').first();
  await expect(link).toHaveAttribute("href", /^https:\/\/www\.nexusmods\.com\/skyrimspecialedition\/mods\/\d+$/);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noreferrer");
  await page.goto("/gear?q=glass+cuirass");
  const row = page.locator("table tbody tr").filter({ has: page.getByRole("link", { name: "Glass Cuirass", exact: true }) });
  await expect(row.getByText("Skyrim.esm", { exact: true })).toBeVisible();
  await expect(row.getByRole("link", { name: /Skyrim\.esm/ })).toHaveCount(0);
});

test("an old id in an item's also redirects to the item's page", async ({ page }) => {
  // The Helgen quest's Steel Arrow (Skyrim.esm:105EE7) is in the game's own Steel Arrow's `also`.
  await page.goto("/gear/skyrim-esm-105ee7");
  await expect(page).toHaveURL(/\/gear\/skyrim-esm-01397f$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Steel Arrow");
  await expect(page.getByRole("region", { name: "Records" }).getByText("105EE7")).toBeVisible();
});
