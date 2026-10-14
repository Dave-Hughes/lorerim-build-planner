import { expect, test } from "@playwright/test";
import { AZREM_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const canvasShift = (page: import("@playwright/test").Page) =>
  page.getByRole("region", { name: /^Perks at level/ }).locator('[class*="canvas"]').evaluate((e) => getComputedStyle(e).transform);

test("selecting a star shows what it does in the right column; × clears it; a card perk opens there too", async ({ page }) => {
  await page.goto("/b/sample?level=6");
  const perks = page.getByRole("region", { name: "Perks at level 6" });
  await perks.getByRole("tab", { name: /^Block/ }).click();
  await perks.getByRole("button", { name: /^Powerful Bashes, Block 25, taken/ }).click();
  const details = perks.getByRole("region", { name: "Perk details" });
  await expect(details.getByRole("heading", { name: "Powerful Bashes" })).toBeVisible();
  await expect(details.locator("p.flavor")).not.toHaveCount(0);
  await expect(details).toContainText("Taken at level 6.");
  await details.getByRole("button", { name: "Close perk details" }).click();
  await expect(perks.getByRole("region", { name: "Perk details" })).toHaveCount(0);

  // A star not taken: its status says whether the build could take it at this level.
  await perks.getByRole("button", { name: /^Overpowering Bashes,/ }).click();
  await expect(perks.getByRole("region", { name: "Perk details" })).toContainText(/(Can be taken at level 6|Not taken by level 6)\./);
  await page.keyboard.press("Escape");
  await expect(perks.getByRole("region", { name: "Perk details" })).toHaveCount(0);

  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  await page.getByRole("region", { name: "Level 6", exact: true }).getByRole("button", { name: "Dodge" }).click();
  const azrem = page.getByRole("region", { name: "Perks at level 6" });
  await expect(azrem.getByRole("tab", { name: /^Evasion/ })).toHaveAttribute("aria-selected", "true");
  await expect(azrem.getByRole("button", { name: /^Dodge, / })).toHaveAttribute("aria-pressed", "true");
  await expect(azrem.getByRole("region", { name: "Perk details" }).getByRole("heading", { name: "Dodge" })).toBeVisible();
  // Changing level keeps the perk and updates its status line.
  await page.getByRole("button", { name: "Previous level" }).first().click();
  await expect(page.getByRole("region", { name: "Perks at level 5" }).getByRole("region", { name: "Perk details" })).toContainText(/Not taken by level 5|Can be taken at level 5/);
});

test("dragging One-Handed pans it, a click afterwards still selects, a plain wheel scrolls the page, Fit shows every star", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  const perks = page.getByRole("region", { name: "Perks at level 6" });
  await perks.getByRole("tab", { name: /^One-Handed/ }).click();
  await perks.scrollIntoViewIfNeeded();
  const box = (await perks.locator('[class*="sky"]').first().boundingBox())!;
  // Trees open fitted (WO-73): zoom in so there's something to pan.
  await perks.getByRole("button", { name: "Zoom in" }).click();
  await perks.getByRole("button", { name: "Zoom in" }).click();
  const before = await canvasShift(page);
  await page.mouse.move(box.x + 40, box.y + box.height - 60);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + box.height - 220, { steps: 6 });
  await page.mouse.up();
  const after = await canvasShift(page);
  expect(after).not.toBe(before);

  // A click after the drag selects the star clicked.
  const star = perks.getByRole("button", { name: /^Penetrating Strikes, / });
  await star.click();
  await expect(star).toHaveAttribute("aria-pressed", "true");

  // A plain wheel over the tree scrolls the page, not the tree.
  const y0 = await page.evaluate(() => window.scrollY);
  const shift0 = await canvasShift(page);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y0);
  expect(await canvasShift(page)).toBe(shift0);

  // Fit: every star inside the box.
  await perks.getByRole("button", { name: "Fit", exact: true }).click();
  const sb = (await perks.locator('[class*="sky"]').first().boundingBox())!;
  const stars = await perks.locator('[class*="sky"] button[aria-pressed]').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
  expect(stars.length).toBeGreaterThan(10);
  for (const s of stars) {
    expect(s.x).toBeGreaterThanOrEqual(sb.x);
    expect(s.x).toBeLessThanOrEqual(sb.x + sb.width);
    expect(s.y).toBeGreaterThanOrEqual(sb.y);
    expect(s.y).toBeLessThanOrEqual(sb.y + sb.height);
  }
});
