import { expect, test } from "@playwright/test";
import { AZREM_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("the about bar reads Race, Birthsign, Deity, Traits, Game mode, Start", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}`);
  const bar = page.getByRole("region", { name: "Character", exact: true });
  const labels = await bar.locator(":scope > div > .label").allTextContents();
  expect(labels).toEqual(["Race", "Birthsign", "Deity", "Traits", "Game mode", "Start"]);
});

test("every value explains itself; each trait on its own; Start opens a popover", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}`);
  const bar = page.getByRole("region", { name: "Character", exact: true });
  const tip = page.getByRole("tooltip");
  const hover = async (name: string | RegExp, text: RegExp) => {
    await bar.getByText(name, { exact: true }).hover();
    await expect(tip.filter({ hasText: text })).toBeVisible();
    await page.mouse.move(0, 0);
  };
  await hover("Redguard", /Health.*Magicka.*Stamina/);
  await hover("The Lover", /./);
  await hover("The HoonDing", /Follower: [\s\S]*Devotee: [\s\S]*Tenets/);
  await hover("Phalanx", /./);
  await hover(/^Focused Combat/, /./);
  // Separate targets: the two traits' tips differ.
  await bar.getByText("Phalanx", { exact: true }).hover();
  const phalanx = await tip.filter({ visible: true }).first().innerText();
  await page.mouse.move(0, 0);
  await bar.getByText(/^Focused Combat/).hover();
  const focused = await tip.filter({ visible: true }).first().innerText();
  expect(phalanx).not.toEqual(focused);
  await page.mouse.move(0, 0);
  await hover("Konahrik", /classic rules/);

  await page.goto("/b/sample");
  const start = page.getByRole("region", { name: "Character", exact: true }).getByRole("button", { name: /Out in the Wilderness/ });
  await expect(start).toHaveText("Out in the Wilderness · Falkreath");
  await start.click();
  const pop = page.getByRole("dialog", { name: "Start: Out in the Wilderness" });
  await expect(pop).toContainText("Hold: Falkreath");
  await page.keyboard.press("Escape");
  await expect(pop).toHaveCount(0);
});
