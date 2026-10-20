import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { SPELLS_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("the Oghma Infinium: six skills at +5 and 3 perk points on the level", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${SPELLS_BUILD_ID}/edit?level=6`);
  const oghma = page.getByRole("group", { name: "Oghma Infinium" });
  await oghma.getByRole("button", { name: "Add" }).click();
  const six = ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration", "Enchanting"];
  for (const [i, sk] of six.entries()) {
    await oghma.getByRole("button", { name: sk, exact: true }).click();
    await expect(oghma).toContainText(`${i + 1} of 6 chosen`);
  }
  // A seventh can't be chosen.
  await expect(oghma.getByRole("button", { name: "Smithing", exact: true })).toBeDisabled();
  await oghma.getByRole("button", { name: "Add" }).click();
  await expect(page.getByRole("button", { name: "Remove the Oghma Infinium" })).toBeVisible();
  await expect(page.getByText("✓ Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  await page.goto(`/b/${SPELLS_BUILD_ID}?level=6`);
  const card = page.getByRole("region", { name: "Level 6", exact: true });
  await expect(card).toContainText("Oghma Infinium");
  await expect(card).toContainText("+3 perk points");
  for (const sk of six) await expect(card).toContainText(sk);
});
