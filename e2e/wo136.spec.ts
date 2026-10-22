/** WO-136 ruling 3: Missives show once, as the class, with one sentence and where the boards are; not one row per job. */
import { expect, test } from "@playwright/test";

const SAYS = "Missives: take a missive from the notice board in any hold's capital or a courier's request; each is a short delivery.";

test("the Missives page says the class once, and lists no job one by one", async ({ page }) => {
  await page.goto("/quests/missives");
  await expect(page.getByRole("heading", { name: "Jobs from a board" })).toBeVisible();
  // Once in the quests, and once as the way in under How to start it.
  await expect(page.locator("#quests-title").locator("..").locator("..").getByText(SAYS, { exact: true })).toHaveCount(1);
  await expect(page.getByText("Where the boards are isn't checked yet.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Journal ›" })).toHaveCount(0);
});
