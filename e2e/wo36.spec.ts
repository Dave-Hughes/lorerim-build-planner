import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("hovering a chosen tag in Set up keeps its name readable", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/setup?step=name`);
  await page.getByRole("button", { name: "+ Add a tag" }).click();
  const tags = page.getByRole("group", { name: "Tags" });
  const chip = tags.getByRole("button", { name: "Roleplay" });
  if ((await chip.getAttribute("aria-pressed")) !== "true") await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  await chip.hover();
  // Let the hover transition settle.
  await page.waitForTimeout(300);
  const { color, background } = await chip.evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, background: s.backgroundColor };
  });
  expect(color).not.toBe(background);
  await expect(tags.locator('img[src="/icons/tag-roleplay.svg"]')).toBeVisible();
  await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "false");
});

test("Roleplay is under Way of play on Browse", async ({ page }) => {
  await page.goto("/characters");
  await page.getByRole("button", { name: /^Tags/ }).click();
  const tags = page.getByRole("group", { name: "Tags" });
  await expect(tags.locator('img[src="/icons/tag-roleplay.svg"]').locator("xpath=..")).toContainText("Roleplay");
});

test("the version band is on the Race step only, and the last step reads Details", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/setup?step=race`);
  await expect(page.getByText(/LoreRim 5\.0/).first()).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Setup steps" }).getByRole("listitem").last().getByRole("button")).toContainText("Details");
});

test("liking plays the burst once; reduced motion shows none", async ({ page, context }) => {
  await signIn(context, "other");
  await page.goto(`/b/${TEST_BUILD_ID}`);
  const like = page.getByRole("button", { name: /^Like/ });
  await like.click();
  await expect(page.getByRole("button", { name: /^Liked/ })).toHaveAttribute("aria-busy", "false");
  // The burst is decorative and takes no clicks.
  const burst = page.locator('[aria-hidden="true"]').filter({ has: page.locator("svg rect") }).first();
  await expect(burst).toHaveCSS("pointer-events", "none");
  await page.getByRole("button", { name: /^Liked/ }).click();
  await expect(page.getByRole("button", { name: /^Like\b/ })).toHaveAttribute("aria-busy", "false");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /^Like/ }).click();
  await expect(burst).toBeHidden();
  await page.getByRole("button", { name: /^Liked/ }).click();
  await expect(page.getByRole("button", { name: /^Like\b/ })).toHaveAttribute("aria-busy", "false");
});
