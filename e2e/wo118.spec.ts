/**
 * WO-118, calmer: the story one click away (Read the story and Continue reading beside the tabs, the
 * reader's Contents), and the rest of the order's checks as the parts land.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { KYRIA_PLAYTHROUGH_ID } from "./seed";

const KYRIA = `/p/${KYRIA_PLAYTHROUGH_ID}`;
const reader = (page: Page) => page.getByRole("dialog");
const readTheStory = (page: Page) => page.getByRole("link", { name: /^Read the story/ }).first();

test("Read the story sits at the right of the tab row; the reader's Contents jumps to a chapter; Continue reading names it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  // In the tab row, on every tab; the hero's old button is gone.
  await expect(page.getByRole("link", { name: "Read the story from the beginning" })).toHaveCount(0);
  await expect(readTheStory(page)).toBeVisible();
  await page.getByRole("tab", { name: /^Levels/ }).click();
  await expect(readTheStory(page)).toBeVisible();
  await readTheStory(page).click();
  await expect(reader(page)).toBeVisible();

  // Contents: every chapter in reading order, the locked ones with their lock and what unlocks them.
  await reader(page).getByRole("button", { name: "Contents" }).click();
  const contents = reader(page).getByRole("navigation", { name: "Contents" });
  await expect(contents.getByRole("button", { name: /Chapter One: The Chapel by the Sea/ })).toBeVisible();
  const locked = contents.getByRole("button", { name: /Made with Care/ });
  await expect(locked.getByRole("img", { name: "Locked" })).toBeVisible();
  await expect(locked).toContainText("Unlocks when you tick Hunt and tan her first hides.");
  await contents.getByRole("button", { name: /The Mark of Dibella/ }).click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${KYRIA}/story/\\d+$`));

  // Esc closes the list first, then the reader.
  await reader(page).getByRole("button", { name: "Contents" }).click();
  await expect(contents).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(contents).toHaveCount(0);
  await expect(reader(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(reader(page)).toHaveCount(0);

  // Continue reading, with the chapter's name, then and after a reload (the owner's readAt).
  await expect(page.getByText("Continue reading").first()).toBeVisible();
  await expect(readTheStory(page)).toHaveAccessibleName("Read the story: continue at The Mark of Dibella");
  await page.reload();
  await expect(readTheStory(page)).toHaveAccessibleName("Read the story: continue at The Mark of Dibella");
  await readTheStory(page).click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
});
