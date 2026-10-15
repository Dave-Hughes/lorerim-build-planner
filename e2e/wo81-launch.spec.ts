/**
 * WO-81: the launch view, with both switches off (the "launch" project's server, FEATURE_STORY and
 * FEATURE_SITE_GUIDE off). With both on, the Story and guide tests (wo79, wo66 to wo70) run as before.
 */
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, HEALER_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("point 2: Story off: no Story tab, page, edit-bar link or card tag, though the healer has one saved", async ({ page, context }) => {
  // The healer is the test author's private build.
  await signIn(context);
  await page.goto(`/b/${HEALER_BUILD_ID}?tab=story`);
  // ?tab=story opens the Levels tab: the level card is there.
  await expect(page.locator("#level-card")).toBeVisible();
  await expect(page.getByRole("tab", { name: /^Story/ })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Story" })).toHaveCount(0);
  await expect(page.getByText("The Mender")).toHaveCount(0);

  const res = await page.goto(`/b/${HEALER_BUILD_ID}/story`);
  expect(res?.status()).toBe(404);
  await page.goto(`/b/${HEALER_BUILD_ID}/edit`);
  const bar = page.getByRole("region", { name: "Edit bar" });
  await expect(bar.getByRole("link", { name: "Guide", exact: true })).toBeVisible();
  await expect(bar.getByRole("link", { name: "Story", exact: true })).toHaveCount(0);
  // The author's builds: the healer's card (and every other) has no Story tag.
  await page.goto("/me");
  await expect(page.locator("article").first()).toBeVisible();
  await expect(page.locator("article").getByText("Story", { exact: true })).toHaveCount(0);
});

test("point 3: site guide off: every /guide route is not found, and nav and footer have no Guide link", async ({ page }) => {
  for (const path of ["/guide", "/guide/terms", "/guide/mods", "/guide/questions"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
  }
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Builds" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Guide" })).toHaveCount(0);
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Guide", exact: true })).toHaveCount(0);
});

test("point 3: a build's own Guide tab still works, with nothing linking to /guide", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?tab=guide`);
  const tab = page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Guide/ });
  await expect(tab).toHaveAttribute("aria-selected", "true");
  const panel = page.locator("#panel-guide");
  await expect(panel).toBeVisible();
  expect((await panel.innerText()).length).toBeGreaterThan(200);
  await expect(page.locator('a[href^="/guide"]')).toHaveCount(0);
});
