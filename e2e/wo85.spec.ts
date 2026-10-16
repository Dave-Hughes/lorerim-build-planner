/** WO-85: the coming soon page, second pass (the canvas boards ComingSoon2 and ComingSoon2Phone). */
import { expect, test } from "@playwright/test";
import { DISCORD } from "../src/lib/links";

test("every Discord link goes to the LoreRim Discord; the trait cards read the game's text", async ({ page }) => {
  await page.goto("/coming-soon");
  const links = page.getByRole("link", { name: /LoreRim Discord|Modding Bungalo/ });
  // Since WO-87 and the 15 Oct fixes: Modding Bungalo under the hero's Opening soon, Modding Bungalo and the
  // button in Share it, Modding Bungalo under Coming later's Opening soon, and the foot.
  await expect(links).toHaveCount(5);
  for (const l of await links.all()) await expect(l).toHaveAttribute("href", DISCORD);
  // Focused Combat and Witcher, from traits.json, with the benefit and cost numbers coloured.
  const traits = page.getByRole("region", { name: "Race, deity, traits, perks, gear and more" });
  await expect(traits).toContainText("Focused Combat");
  await expect(traits).toContainText("Witcher");
  await expect(traits.locator('b[data-trait="benefit"]').first()).toHaveText("10%");
  await expect(traits.locator('b[data-trait="cost"]').first()).toBeVisible();
});

test.describe("at 390", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("no sideways scroll, and each section's heading comes before its visual", async ({ page }) => {
    await page.goto("/coming-soon");
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    for (const name of ["Plan a character", "Race, deity, traits, perks, gear and more", "Iriel Thornwhisper's Marksman perks", "Share it"]) {
      const section = page.getByRole("region", { name, exact: true });
      const heading = await section.getByRole("heading", { level: 2 }).first().boundingBox();
      const visual = await section.locator('[class*="featureVisual"]').boundingBox();
      expect(heading!.y + heading!.height, name).toBeLessThanOrEqual(visual!.y);
    }
  });
});
