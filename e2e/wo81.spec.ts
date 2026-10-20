/** WO-81 with both switches on (the main server): what the launch view hides is all still there. */
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { HEALER_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("with both on: the healer's Story in the reader, the Story page and the site guide are there", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${HEALER_BUILD_ID}/story`);
  await expect(page.getByRole("dialog").getByRole("heading", { name: "The Mender" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Story", exact: true })).toBeVisible();
  expect((await page.goto("/guide"))?.status()).toBe(200);
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Guide" })).toBeVisible();
});
