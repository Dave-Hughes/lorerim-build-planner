import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { GEAR_BUILD_ID, SCRATCH_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("a dividing line in the guide is a line, and the next paragraph sits right under it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${SCRATCH_BUILD_ID}/guide`);
  const guide = page.getByRole("textbox", { name: "Guide" });
  await guide.click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("Delete");
  await page.keyboard.type("First paragraph.");
  await page.keyboard.press("Enter");
  await page.getByRole("region", { name: "Guide" }).getByRole("toolbar", { name: "Format" }).getByRole("button", { name: "Divider" }).click();
  await page.keyboard.type("Second paragraph.");
  const line = guide.locator("hr").first();
  const lineBox = (await line.evaluate((el) => (el.closest('[contenteditable="false"]') ?? el).getBoundingClientRect().toJSON())) as DOMRect;
  expect(lineBox.height).toBeLessThan(60);
  const second = (await guide.getByText("Second paragraph.").boundingBox())!;
  expect(second.y - (lineBox.y + lineBox.height)).toBeLessThan(40);
});

test("searching Jephre on Browse builds finds Iriel", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("Jephre");
  await expect(page.getByRole("article").filter({ hasText: "Iriel Thornwhisper" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("after Confirm the perk card is closed", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${GEAR_BUILD_ID}/edit?level=6`);
  await page.getByRole("button", { name: "Continue to level 7" }).click();
  await page.getByRole("button", { name: /^Health/ }).click();
  const raise = page.getByRole("button", { name: "Raise Block" });
  for (let i = 0; i < 4; i++) await raise.click();
  await page.getByRole("button", { name: "Block", exact: true }).click();
  await page.getByRole("button", { name: /Overpowering Bashes, Block 50, can take now/ }).click();
  const card = page.getByRole("complementary", { name: "Perk details" }).filter({ hasText: "Overpowering Bashes" });
  await card.getByRole("button", { name: "Confirm" }).click();
  await expect(card).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Overpowering Bashes, Block 50, taken/ })).toBeVisible();
});

test("the owner's build page has one Copy link and one Edit; the Guide tab has no GUIDE label", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}?tab=guide`);
  await expect(page.getByRole("button", { name: "Copy link" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: /^Edit/ })).toHaveCount(1);
  await expect(page.getByRole("region", { name: "Guide" }).locator(":scope > .label")).toHaveCount(0);
});
