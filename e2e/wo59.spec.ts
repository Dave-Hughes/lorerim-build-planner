import { expect, test, type Locator, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { FORTY_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const frameOf = (page: Page) => page.locator("[data-perk]").first().locator("xpath=ancestor::div[contains(@class, 'treeBox')]");
const inside = async (inner: Locator, outer: Locator) => {
  const a = (await inner.boundingBox())!;
  const b = (await outer.boundingBox())!;
  expect(a.x).toBeGreaterThanOrEqual(b.x - 1);
  expect(a.y).toBeGreaterThanOrEqual(b.y - 1);
  expect(a.x + a.width).toBeLessThanOrEqual(b.x + b.width + 1);
  expect(a.y + a.height).toBeLessThanOrEqual(b.y + b.height + 1);
};

test("a ring's card opens beside it in the tree frame; Confirm takes it, the line shows, Undo takes it back", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=30`);
  await page.getByRole("button", { name: "Block", exact: true }).click();
  const ring = page.getByRole("button", { name: /, can take now$/ }).first();
  const label = (await ring.getAttribute("aria-label"))!;
  const name = label.split(",")[0];
  await ring.click();
  const card = page.getByRole("dialog", { name: "Perk details" });
  await expect(card).toContainText(name);
  await inside(card, frameOf(page));
  // Next to the star: its near edge within a few dozen pixels of the star.
  const s = (await ring.boundingBox())!;
  const c = (await card.boundingBox())!;
  const gap = Math.min(Math.abs(c.x - (s.x + s.width)), Math.abs(s.x - (c.x + c.width)));
  expect(gap).toBeLessThan(40);
  await expect(card.getByRole("button", { name: "Confirm" })).toBeFocused();

  await card.getByRole("button", { name: "Confirm" }).click();
  const line = page.getByRole("status").filter({ hasText: "taken." });
  await expect(line).toContainText(`${name} taken.`);
  await expect(line).toContainText(/\d+ perk points? left\./);
  await expect(page.getByRole("button", { name: new RegExp(`^${name}, .*taken`) })).toBeVisible();
  await line.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("button", { name: label })).toBeVisible();
  await expect(line).toHaveCount(0);
});

test("the card stays inside the frame for the star furthest right and the one at the top", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=30`);
  await page.getByRole("button", { name: "Block", exact: true }).click();
  const stars = page.locator("[data-perk]");
  const boxes = await stars.evaluateAll((els) => els.map((e) => ({ id: e.getAttribute("data-perk")!, ...e.getBoundingClientRect().toJSON() })));
  const right = boxes.reduce((a, b) => (b.x > a.x ? b : a));
  const top = boxes.reduce((a, b) => (b.y < a.y ? b : a));
  for (const st of [right, top]) {
    // From the keyboard: a star at the frame's edge can sit under a neighbour's label.
    await page.locator(`[data-perk="${st.id}"]`).focus();
    await page.keyboard.press("Enter");
    const card = page.getByRole("dialog", { name: "Perk details" });
    await expect(card).toBeVisible();
    await inside(card, frameOf(page));
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
  }
});
