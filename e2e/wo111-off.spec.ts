/**
 * WO-111: playthroughs switched off, on the "launch" project's server (FEATURE_PLAYTHROUGHS off).
 */
import { expect, test } from "@playwright/test";
import { KYRIA_PLAYTHROUGH_ID } from "./seed";

test("with FEATURE_PLAYTHROUGHS off, its pages are not found and the header has no Playthroughs", async ({ page, request }) => {
  for (const path of [`/p/${KYRIA_PLAYTHROUGH_ID}`, `/p/${KYRIA_PLAYTHROUGH_ID}/tale`, "/playthroughs", "/playthroughs/new"]) expect((await request.get(path)).status(), path).toBe(404);
  await page.goto("/characters");
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Playthroughs" })).toHaveCount(0);
});

// WO-114, WO-182: with the switch off, a new character is a character: the header says New character, the rail has its seven steps and no What next.
test("with FEATURE_PLAYTHROUGHS off, /new opens Set up and the header says New character, with no What next", async ({ page }) => {
  await page.goto("/new");
  await expect(page.getByLabel("Setup steps")).toBeVisible();
  await expect(page.getByLabel("Setup steps").getByRole("listitem")).toHaveCount(7);
  await expect(page.getByLabel("Setup steps")).not.toContainText("What next");
  await expect(page.getByRole("heading", { name: "What are you making?" })).toHaveCount(0);
  await expect(page.getByRole("banner")).toContainText("New character");
});
