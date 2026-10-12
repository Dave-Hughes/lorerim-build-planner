import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { SCRATCH_BUILD_ID } from "./seed";

const typeNote = async (page: Page, level: number, text: string) => {
  const notes = page.getByRole("textbox", { name: `Notes for level ${level}` });
  await notes.click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("Delete");
  await page.keyboard.type(text);
};

test.describe("level notes are never lost", () => {
  test("typing a note and changing level at once keeps it", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SCRATCH_BUILD_ID}/edit?level=6`);
    await typeNote(page, 6, "Typed, then straight on to the next level.");
    await page.getByRole("button", { name: "Continue to level 7" }).click();
    await expect(page.getByText("Level up to").locator("..")).toContainText("7");
    // Let the level itself save, then come back from a fresh page.
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });
    await page.goto(`/b/${SCRATCH_BUILD_ID}?level=6`);
    await expect(page.getByRole("region", { name: "Notes for level 6" })).toContainText("Typed, then straight on to the next level.");
  });

  test("typing a note and leaving the page at once keeps it", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SCRATCH_BUILD_ID}/edit?level=5`);
    await typeNote(page, 5, "Typed, then off to another page.");
    await page.goto("/");
    // The note left with the page (a keepalive request): it may still be on its way.
    await expect(async () => {
      await page.goto(`/b/${SCRATCH_BUILD_ID}?level=5`);
      await expect(page.getByRole("region", { name: "Notes for level 5" })).toContainText("Typed, then off to another page.", { timeout: 1000 });
    }).toPass({ timeout: 10_000 });
  });
});

test("the two Destiny stars called Endurance have different names", async ({ page }) => {
  await page.goto("/b/sample?level=6");
  // Destiny's own section (WO-27).
  const trees = page.getByRole("region", { name: "Destiny at level 6" });
  await expect(trees.getByRole("button", { name: /^Endurance \(to Thief\),/ })).toHaveCount(1);
  await expect(trees.getByRole("button", { name: /^Endurance \(to Smash\),/ })).toHaveCount(1);
  await expect(trees.getByRole("button", { name: /^Endurance,/ })).toHaveCount(0);
});

test("a trait's choice shows on the shared page", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${SCRATCH_BUILD_ID}/setup`);
  await page.getByRole("complementary", { name: "Setup steps" }).getByRole("button", { name: /Traits/ }).click();
  await page.getByRole("article").filter({ hasText: "Witcher" }).getByRole("button", { name: "Chosen" }).click();
  const focused = page.getByRole("article").filter({ hasText: "Focused Combat" });
  await focused.getByRole("heading", { name: "Focused Combat" }).click();
  await focused.getByRole("combobox").selectOption("Two-Handed");
  await expect(focused.getByRole("button", { name: "Chosen" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("complementary", { name: "Setup steps" }).getByRole("button", { name: /Name/ }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL(new RegExp(`/b/${SCRATCH_BUILD_ID}/edit`));
  await page.goto(`/b/${SCRATCH_BUILD_ID}`);
  await expect(page.getByRole("region", { name: "Character", exact: true })).toContainText("Focused Combat: Two-Handed");
});

test("the Guide page opens straight on its content", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${SCRATCH_BUILD_ID}/guide`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Guide");
  await expect(page.getByText(/how to play this build/)).toHaveCount(0);
});
