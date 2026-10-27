import { expect, test } from "@playwright/test";
import { IRIEL_BUILD_ID, SCRATCH_BUILD_ID } from "./seed";

/** A PNG's width and height, from its header. */
function pngSize(b: Buffer) {
  expect(b.subarray(1, 4).toString()).toBe("PNG");
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

test("Iriel's page points og:image at her card, a 1200x630 PNG", async ({ page, request }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(image).toMatch(new RegExp(`/b/${IRIEL_BUILD_ID}/card\\.png\\?v=\\d+$`));
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "LoreRim Build Planner");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const res = await request.get(new URL(image!).pathname + new URL(image!).search);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/png");
  expect(pngSize(await res.body())).toEqual({ width: 1200, height: 630 });
});

test("the home page's og:image is the site card; a private build shows nothing of itself", async ({ page, request }) => {
  await page.goto("/characters");
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(new URL(image!).pathname).toBe("/og/site.png");
  const res = await request.get("/og/site.png");
  expect(pngSize(await res.body())).toEqual({ width: 1200, height: 630 });

  await page.goto(`/b/${SCRATCH_BUILD_ID}`);
  await expect(page).toHaveTitle("LoreRim Build Planner");
  expect(new URL((await page.locator('meta[property="og:image"]').getAttribute("content"))!).pathname).toBe("/og/site.png");
  expect((await request.get(`/b/${SCRATCH_BUILD_ID}/card.png`)).status()).toBe(404);
});
