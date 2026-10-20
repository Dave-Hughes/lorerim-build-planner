/**
 * WO-111: playthroughs switched off, on the "launch" project's server (FEATURE_PLAYTHROUGHS off).
 */
import { expect, test } from "@playwright/test";
import { KYRIA_PLAYTHROUGH_ID } from "./seed";

test("with FEATURE_PLAYTHROUGHS off, its pages are not found and the header has no Playthroughs", async ({ page, request }) => {
  for (const path of [`/p/${KYRIA_PLAYTHROUGH_ID}`, `/p/${KYRIA_PLAYTHROUGH_ID}/tale`, "/playthroughs", "/playthroughs/new"]) expect((await request.get(path)).status(), path).toBe(404);
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Playthroughs" })).toHaveCount(0);
});
