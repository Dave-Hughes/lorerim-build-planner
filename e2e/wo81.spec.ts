/** WO-81 with both switches on (the main server): what the launch view hides is all still there. */
import { expect, test } from "@playwright/test";
import { signIn, editTab } from "./helpers";
import { HEALER_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("with both on: no Story reader or tab, and the site guide is there", async ({ page, context }) => {
  await signIn(context);
  // WO-181: the Story is retired, with the switch on too: no reader, no Story tab.
  await page.goto(`/b/${HEALER_BUILD_ID}/story`);
  await expect(page.getByRole("region", { name: /^Reading: / })).toHaveCount(0);
  await page.goto(`/b/${HEALER_BUILD_ID}/edit`);
  await expect(editTab(page, "Story")).toHaveCount(0);
  expect((await page.goto("/guide"))?.status()).toBe(200);
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Guide" })).toBeVisible();
});
