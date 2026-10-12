import { expect, test } from "@playwright/test";
import { IRIEL_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const GEAR_LEVELS = [1, 6, 10, 14, 18, 20, 22, 26, 30];

test("Destiny is one line without a star at the level, open at 25, and Show the tree opens it", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}?level=22`);
  const destiny = page.getByRole("region", { name: "Destiny at level 22" });
  const toggle = destiny.getByRole("button", { name: "Show the tree" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(destiny).toContainText("Destiny, Endurance (to Thief), Thief, Adrenaline, Scout");
  await expect(destiny).toContainText("Next star at level 25");
  await expect(destiny.getByRole("region", { name: /taken by level/i })).toHaveCount(0);
  await toggle.click();
  await expect(destiny.getByRole("button", { name: "Hide the tree" })).toHaveAttribute("aria-expanded", "true");
  await expect(destiny.getByRole("region", { name: "Destiny taken by level 22" })).toBeVisible();

  await page.goto(`/b/${IRIEL_BUILD_ID}?level=25`);
  const at25 = page.getByRole("region", { name: "Destiny at level 25" });
  await expect(at25.getByRole("button", { name: "Hide the tree" })).toHaveAttribute("aria-expanded", "true");
  await expect(at25.getByRole("region", { name: "Destiny taken by level 25" })).toBeVisible();
});

test("clicking Elven Light Bow in the timeline goes to level 14", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}?level=22`);
  const bar = page.getByRole("link", { name: "Elven Light Bow, levels 14 to 25" });
  await bar.focus();
  await expect(bar).toBeFocused();
  await bar.click();
  await expect(page.getByRole("heading", { level: 2, name: "Level 14", exact: true })).toBeVisible();
  expect(page.url()).toContain("level=14");
});

test("the gear mark is at 1, 6, 10, 14, 18, 20, 22, 26 and 30 and nowhere else", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}?level=22`);
  const ruler = page.getByRole("region", { name: "Level", exact: true });
  const marked = await ruler.locator("img[data-gear-level]").evaluateAll((els) => els.map((e) => Number(e.getAttribute("data-gear-level"))));
  expect(marked).toEqual(GEAR_LEVELS);
  // The tiles in view: levels 16 to 27.
  for (let L = 16; L <= 27; L++) {
    const tile = ruler.getByRole("button", { name: new RegExp(`^Level ${L},`) }).or(ruler.getByRole("button", { name: `Level ${L}`, exact: true }));
    const name = await tile.first().getAttribute("aria-label");
    expect(name?.includes("new gear"), `tile ${L}`).toBe(GEAR_LEVELS.includes(L));
  }
  // The pinned bar: a Gear chip at 22, none at 23.
  await page.getByRole("region", { name: "Perks at level 22" }).scrollIntoViewIfNeeded();
  const pinned = page.getByRole("region", { name: "Pinned bar" });
  await expect(pinned.getByRole("button", { name: "Gear" })).toBeVisible();
  await pinned.getByRole("button", { name: "Next level" }).click();
  await expect(pinned.getByLabel("What level 23 changed")).toBeVisible();
  await expect(pinned.getByRole("button", { name: "Gear" })).toHaveCount(0);
});
