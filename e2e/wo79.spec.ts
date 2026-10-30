/**
 * WO-79: the Story. One author writes it (title, opening line, three paragraphs, a quote, five
 * captioned images, a sixth refused); then a reader opens it in the reader (WO-116).
 */
import { expect, test } from "@playwright/test";
import { SEVARI_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });
test.describe.configure({ mode: "serial" });

test("point 1: a build without a Story has no way into the reader", async ({ page }) => {
  await page.goto(`/b/${SEVARI_BUILD_ID}`);
  await expect(page.getByRole("link", { name: /^Read the story/ }).first()).toHaveCount(0);
});
