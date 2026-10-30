/** WO-136 ruling 3: Missives show once, as the class, with one sentence and where the boards are; not one row per job. */
import { expect, test } from "@playwright/test";

const SAYS = "Missives: take a missive from the notice board in any hold's capital or a courier's request.";

test("the Missives page says the class once, and lists its kinds with each job linked, not one journal per job", async ({ page }) => {
  await page.goto("/quests/missives");
  await expect(page.getByRole("heading", { name: "Jobs from a board" })).toBeVisible();
  // Said once (WO-160: the page's Jobs from a board section).
  await expect(page.getByText(SAYS, { exact: true })).toHaveCount(1);
  // The 12 boards the records place (23c2d9d's board reader).
  await expect(page.getByText(/^Where the boards are: Ben Erai; .*Winterhold\.$/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Journal ›" })).toHaveCount(0);
});
