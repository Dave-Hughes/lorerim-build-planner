/**
 * WO-123 Part 1: every objective has a box, a number to reach too; one the save can read shows Ticks from your save
 * in Edit's Play tab, on by default, and one with nothing to read shows no switch.
 */
import { expect, test } from "@playwright/test";
import { KYRIA_PLAYTHROUGH_ID } from "./seed";
import { savedInBand, signIn } from "./helpers";

test("a number to reach has a box on Play, and the tick holds", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}`);
  const box = page.getByRole("checkbox", { name: "Play the Bee and Barb until Speech 40" });
  await expect(box).toHaveAttribute("aria-checked", "false");
  await box.click();
  await expect(box).toHaveAttribute("aria-checked", "true");
  await page.reload();
  await expect(box).toHaveAttribute("aria-checked", "true");
  // Back as it was, for the tests after.
  await box.click();
  await expect(box).toHaveAttribute("aria-checked", "false");
});

test("Edit's Play tab: Ticks from your save on a linked objective, none on one of her own", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await page.getByRole("button", { name: "Edit Hunt and tan her first hides" }).click();
  await expect(page.getByRole("switch")).toHaveCount(0);

  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  const sw = page.getByRole("switch", { name: /Ticks from your save/ });
  await expect(sw).toBeChecked();
  await expect(page.getByRole("button", { name: "About ticking from your save" })).toBeVisible();
  await sw.uncheck();
  await savedInBand(page);
  await page.reload();
  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  await expect(page.getByRole("switch", { name: /Ticks from your save/ })).not.toBeChecked();
  // On again, as the seed has it; the stage the save reads comes back with the link.
  await page.getByRole("switch", { name: /Ticks from your save/ }).check();
  await savedInBand(page);

  await page.getByRole("button", { name: "Edit Play the Bee and Barb until Speech 40" }).click();
  await expect(page.getByRole("switch", { name: /Ticks from your save/ })).toBeChecked();
});
