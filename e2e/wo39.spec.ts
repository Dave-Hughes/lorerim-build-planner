import { expect, test, type Page } from "@playwright/test";
import { signIn, savedInBand } from "./helpers";
import { IRIEL_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const VIDEO = "https://www.youtube.com/watch?v=jNQXAC9IVRw&t=5s";

async function setVideo(page: Page, link: string) {
  await page.goto(`/b/${IRIEL_BUILD_ID}/setup?step=name`);
  const field = page.getByLabel("Video guide (optional)");
  await field.fill(link);
  // Every change saves as it is made (WO-117).
  await savedInBand(page);
}

test("a video guide: the hero button opens the Guide tab with the player, and nothing loads from YouTube before", async ({ page, context }) => {
  await signIn(context, "other");
  await page.goto(`/b/${IRIEL_BUILD_ID}/setup?step=name`);
  await page.getByLabel("Video guide (optional)").fill("https://vimeo.com/123456789");
  await expect(page.getByRole("alert").filter({ hasText: "That isn't a YouTube link." })).toBeVisible();
  await setVideo(page, VIDEO);

  const youtube: string[] = [];
  page.on("request", (r) => {
    const host = new URL(r.url()).hostname;
    if (host === "youtube.com" || host.endsWith(".youtube.com") || host.endsWith("youtube-nocookie.com")) youtube.push(r.url());
  });
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  const watch = page.getByRole("region", { name: "Build" }).getByRole("button", { name: "Watch the video guide" });
  await expect(watch).toBeVisible();
  // First among the hero's buttons.
  await expect(page.getByRole("region", { name: "Build" }).locator(".btn").first()).toHaveText(/Watch the video guide/);
  expect(youtube).toEqual([]);
  await watch.click();
  await expect(page.getByRole("tab", { name: /Guide/ })).toHaveAttribute("aria-selected", "true");
  const player = page.locator('iframe[title^="Video guide"]');
  await expect(player).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/jNQXAC9IVRw\?autoplay=1/);

  // Browse's card carries the Video badge.
  await page.goto("/");
  await expect(page.getByRole("article").filter({ hasText: "Iriel" }).getByText("Video", { exact: true })).toBeVisible();

  await setVideo(page, "");
});

test("an admin features Iriel: first on Browse and two columns wide; others don't see the menu", async ({ page, context }) => {
  await signIn(context, "other");
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await expect(page.getByRole("region", { name: "Build" })).toBeVisible();
  await expect(page.getByRole("button", { name: "More" })).toHaveCount(0);
  await context.clearCookies();

  await signIn(context);
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: /Feature this build/ }).click();
  const more = page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" });
  await expect(more).toBeFocused();
  // Saved once the menu offers the opposite.
  await expect(async () => {
    await more.click();
    await expect(page.getByRole("menuitem", { name: /Stop featuring/ })).toBeVisible({ timeout: 1000 });
  }).toPass();
  await page.keyboard.press("Escape");

  await page.goto("/");
  const cards = page.getByRole("article");
  await expect(cards.first()).toHaveAttribute("aria-label", /^Featured: Iriel/);
  await expect(cards.first().getByText("Featured", { exact: true })).toBeVisible();
  const big = (await cards.nth(0).boundingBox())!;
  const small = (await cards.nth(1).boundingBox())!;
  expect(big.width).toBeGreaterThan(small.width * 1.9);

  // With a search it's an ordinary card.
  await page.goto("/?q=iriel");
  await expect(page.getByRole("article").first()).not.toHaveAttribute("aria-label", /Featured/);

  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: /Stop featuring/ }).click();
  await expect(async () => {
    await more.click();
    await expect(page.getByRole("menuitem", { name: /Feature this build/ })).toBeVisible({ timeout: 1000 });
  }).toPass();
  await page.goto("/");
  await expect(page.getByRole("article").first()).not.toHaveAttribute("aria-label", /Featured/);
});
