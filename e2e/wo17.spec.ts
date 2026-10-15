import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { LONG_BUILD_ID, SCRATCH_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1512, height: 806 } });

// WO-62: the editor has no tree chips; the skill list's rows show the held count after the name.
test("the skill list's rows show their names, values and held counts", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
  const block = page.getByRole("button", { name: "Block", exact: true });
  await expect(block).toHaveText(/Block\s*3/);
  await expect(block.locator("xpath=..")).toContainText("46");
});

test("the notes toolbar's Bulleted list and Divider are there after a reload", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${SCRATCH_BUILD_ID}/edit?level=3`);
  const notes = page.getByRole("textbox", { name: "About level 3" });
  await notes.click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("Delete");
  const bar = page.getByRole("region", { name: "About level 3" }).getByRole("toolbar", { name: "Format" });
  await bar.getByRole("button", { name: "Bulleted list" }).click();
  await page.keyboard.type("Clear Embershard");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Sell the loot");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await bar.getByRole("button", { name: "Divider" }).click();
  await page.keyboard.type("Then Whiterun.");
  await expect(page.getByRole("region", { name: "About level 3" }).getByRole("status")).toHaveText("Saved", { timeout: 15_000 });
  await page.reload();
  const again = page.getByRole("textbox", { name: "About level 3" });
  await expect(again.locator("ul li")).toHaveText(["Clear Embershard", "Sell the loot"]);
  await expect(again.locator("hr")).toHaveCount(1);
});

test("dragging the ruler's window from level 1 to 15 brings level 15 into the row", async ({ page }) => {
  await page.goto(`/b/${LONG_BUILD_ID}?level=1`);
  const ruler = page.getByRole("presentation", { name: /Whole build, levels 1 to 20/ }).or(page.locator('[aria-label="Whole build, levels 1 to 20"]')).first();
  const box = (await ruler.boundingBox())!;
  const xOf = (n: number) => box.x + ((n - 0.5) / 20) * box.width;
  await expect(page.getByRole("button", { name: /^Level 15/ })).toHaveCount(0);
  await page.mouse.move(xOf(1), box.y + 25);
  await page.mouse.down();
  for (let n = 2; n <= 15; n++) await page.mouse.move(xOf(n), box.y + 25, { steps: 2 });
  await page.mouse.up();
  await expect(page.getByRole("button", { name: /^Level 15/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Level 15/ })).toHaveAttribute("aria-current", "true");
});
