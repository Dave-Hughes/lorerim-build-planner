/**
 * WO-84 with FEATURE_COMING_SOON on (the "soon" project's server): every page shows the coming soon
 * page at its own URL, except sign-in, the auth API and signed-in admins.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { IRIEL_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

async function isComingSoon(page: Page) {
  // The title is the pixel wordmark (15 Oct): its alt names the heading.
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/LoreRim\s*Build Planner/);
  // The hero's, and since 15 Oct a second closing Coming later.
  await expect(page.getByText("Opening soon", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "How this started" })).toBeVisible();
}

test("point 2: /, a build, /new and /guide all show the coming soon page, at their own URLs with a 200", async ({ page }) => {
  for (const path of ["/", `/b/${IRIEL_BUILD_ID}`, "/new", "/guide"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    expect(new URL(page.url()).pathname, path).toBe(path);
    await isComingSoon(page);
  }
  await expect(page).toHaveTitle("LoreRim Build Planner");
});

test("point 2: /signin shows the button, the auth API still answers, and an admin sees the real home page", async ({ page, context }) => {
  await page.goto("/signin");
  await expect(page.getByRole("button", { name: "Sign in with Discord" })).toBeVisible();
  await expect(page.getByText("Opening soon")).toHaveCount(0);

  const providers = await page.request.get("/api/auth/providers");
  expect(providers.status()).toBe(200);
  expect(await providers.json()).toHaveProperty("discord");

  // The seeded test author is an admin (ADMIN_DISCORD_IDS).
  await signIn(context);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "LoreRim Planner" })).toBeVisible();
  await expect(page.getByText("Opening soon")).toHaveCount(0);
});
