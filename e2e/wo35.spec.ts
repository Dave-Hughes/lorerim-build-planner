import { expect, test } from "@playwright/test";
import { IRIEL_BUILD_ID } from "./seed";

test.describe("at 2560", () => {
  test.use({ viewport: { width: 2560, height: 1440 } });

  test("the rail goes to Gear and marks it, and Sneak opens the Sneak tree", async ({ page }) => {
    await page.goto(`/b/${IRIEL_BUILD_ID}?level=30`);
    const rail = page.getByRole("navigation", { name: "On this page" });
    await expect(rail).toBeVisible();
    await rail.getByRole("link", { name: /^Gear/ }).click();
    const gear = page.getByRole("region", { name: "Gear at level 30" });
    await expect(gear).toBeInViewport();
    await expect(rail.getByRole("link", { name: /^Gear/ })).toHaveAttribute("aria-current", "true");

    await rail.getByRole("link", { name: /^Sneak/ }).click();
    const perks = page.getByRole("region", { name: "Perks at level 30" });
    await expect(perks.getByRole("tab", { name: /^Sneak/ })).toHaveAttribute("aria-selected", "true");
    await expect(perks).toBeInViewport();
  });

  test("dragging the perk tree pans it by the distance dragged, and a click opens a star", async ({ page }) => {
    await page.goto(`/b/${IRIEL_BUILD_ID}?level=30`);
    const perks = page.getByRole("region", { name: "Perks at level 30" });
    await perks.getByRole("tab", { name: /^Marksman/ }).click();
    await perks.getByRole("button", { name: "Zoom in" }).click();
    await perks.scrollIntoViewIfNeeded();
    const canvas = perks.locator('[class*="canvas"]').first();
    const sky = (await perks.locator('[class*="sky"]').first().boundingBox())!;
    const before = (await canvas.boundingBox())!;
    const x = sky.x + sky.width / 2;
    const y = sky.y + sky.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + 60, { steps: 10 });
    await page.mouse.up();
    const after = (await canvas.boundingBox())!;
    expect(Math.abs(after.y - before.y - 60)).toBeLessThanOrEqual(2);

    await perks.getByRole("button", { name: /^Eagle Eye, / }).click();
    await expect(perks.getByRole("region", { name: "Perk details" })).toContainText("Eagle Eye");
  });
});

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("no rail; Marksman 11 ▸ in the taken list opens the Marksman tree and lists it in full", async ({ page }) => {
    await page.goto(`/b/${IRIEL_BUILD_ID}?level=30`);
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
    const taken = page.getByRole("region", { name: "Taken by level 30", exact: true });
    await expect(taken).toContainText(/Taken by level 30\s*33/);
    await taken.getByRole("button", { name: "Marksman 11 ▸" }).click();
    await expect(page.getByRole("region", { name: "Perks at level 30" }).getByRole("tab", { name: /^Marksman/ })).toHaveAttribute("aria-selected", "true");
    await expect(taken.getByRole("button", { name: /^Ranged Combat Training/ })).toBeVisible();
    await expect(taken.getByRole("button", { name: /^Evasion \d+ ▸$/ })).toBeVisible();
  });
});
